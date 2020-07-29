# ビルド環境向け

# as をつけることでビルド環境に命名を追加
FROM node:10.16.1-alpine as server-build-env
WORKDIR /app
COPY . /app
RUN apk update
RUN yarn install
RUN yarn build

# 本番環境向け

# メインのイメージは特に何もつけなくて良い
FROM node:10.16.1-alpine

WORKDIR /app
# 別のビルドからコピー
COPY --from=server-build-env /app /app
RUN mkdir ./shots
EXPOSE 5000
CMD ["yarn", "start"]
