FROM node:20

RUN apt-get update && apt-get install -y xvfb fonts-liberation gconf-service libappindicator1 libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgbm-dev libgdk-pixbuf2.0-0 libgtk-3-0 libicu-dev libjpeg-dev libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libpng-dev libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 xdg-utils

WORKDIR /puppeteer

COPY package*.json .
COPY package-lock.json .
RUN npm ci

COPY . .

EXPOSE 10000

RUN echo '#!/bin/bash\n\
  Xvfb :40 -screen 0 1024x768x24 -ac &\n\
  export DISPLAY=:40\n\
  exec "$@"' > /start.sh && chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
CMD ["node", "src/main.js"];

