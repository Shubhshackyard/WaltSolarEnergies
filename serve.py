"""Static dev server with HTTP Range support + graceful client-disconnect handling.

Usage:
    python serve.py [port]   (default 5173)

Fixes the noisy ConnectionResetError tracebacks from the stock http.server and
enables smooth <video> streaming/seeking by honouring the Range header.
"""
import os
import re
import sys
import http.server
from http import HTTPStatus

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
HOST = "127.0.0.1"

_QUIET_ERRORS = (ConnectionResetError, ConnectionAbortedError, BrokenPipeError)


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        self._range = None
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return None
        try:
            fs = os.fstat(f.fileno())
            size = fs.st_size
            ctype = self.guess_type(path)
            rng = self.headers.get("Range")
            m = re.match(r"bytes=(\d*)-(\d*)", rng) if rng else None
            if m:
                start = int(m.group(1)) if m.group(1) else 0
                end = int(m.group(2)) if m.group(2) else size - 1
                end = min(end, size - 1)
                if start > end or start >= size:
                    self.send_error(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                    f.close()
                    return None
                length = end - start + 1
                self.send_response(HTTPStatus.PARTIAL_CONTENT)
                self.send_header("Content-Type", ctype)
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
                self.send_header("Content-Length", str(length))
                self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
                self.end_headers()
                f.seek(start)
                self._range = length
                return f
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", ctype)
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Length", str(size))
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        except Exception:
            f.close()
            raise

    def copyfile(self, source, outputfile):
        try:
            remaining = getattr(self, "_range", None)
            if remaining is None:
                super().copyfile(source, outputfile)
                return
            chunk = 64 * 1024
            while remaining > 0:
                data = source.read(min(chunk, remaining))
                if not data:
                    break
                outputfile.write(data)
                remaining -= len(data)
        except _QUIET_ERRORS:
            pass

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except _QUIET_ERRORS:
            self.close_connection = True


class Server(http.server.ThreadingHTTPServer):
    daemon_threads = True

    def handle_error(self, request, client_address):
        if sys.exc_info()[0] in _QUIET_ERRORS:
            return
        super().handle_error(request, client_address)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with Server((HOST, PORT), RangeHandler) as httpd:
        print("Serving http://%s:%d  (Ctrl+C to stop)" % (HOST, PORT))
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
