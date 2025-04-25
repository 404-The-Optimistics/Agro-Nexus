import multiprocessing

# Bind to port 10000 (Render's default port)
bind = "0.0.0.0:10000"

# Number of workers
workers = 1  # Using 1 worker to reduce memory usage

# Worker class
worker_class = "sync"

# Timeout
timeout = 120

# Keep-alive
keepalive = 2

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Preload app
preload_app = True

# Maximum requests per worker
max_requests = 1000
max_requests_jitter = 50 