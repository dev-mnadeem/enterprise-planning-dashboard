FROM node:20-bookworm-slim AS build
WORKDIR /app
# The repo ships yarn.lock, not package-lock.json.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000
COPY . .
# CRA inlines REACT_APP_* at build time, both into the bundle and into
# public/index.html, so these have to be present here rather than at run time.
ARG REACT_APP_API_URL=http://localhost:3006/api
ARG REACT_APP_GOOGLE_MAPS_API_KEY=""
ENV REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY \
    GENERATE_SOURCEMAP=false \
    CI=false
RUN yarn build

FROM nginx:alpine AS runtime
COPY --from=build /app/build /usr/share/nginx/html
# The app is a single-page router: unknown paths must return index.html, not 404.
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
