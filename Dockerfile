FROM ghcr.io/puppeteer/puppeteer:19.7.2




# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Switch to non-root user
USER pptruser

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

RUN npm run build



USER root
# Expose application port


EXPOSE 3000

RUN apt-get update && apt-get install -y chromium

# Start the application
CMD ["npm", "run", "start:prod", "google-chrome-stable"]
