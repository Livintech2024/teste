#!/bin/sh
cp .env ./.env
npx prisma migrate dev
npm run dev