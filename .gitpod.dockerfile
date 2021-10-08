FROM gitpod/workspace-mongodb

# Install custom tools, runtime, etc.
RUN mkdir -p /workspace/mongo && mongod --dbpath /workspace/mongo