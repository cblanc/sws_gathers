# ENSL Gathers App

## Status

A realtime micro web service to organise gathers for ENSL.org

## Design Goals

1) Create a nice place where the NS2 community can assemble and have fun

2) Create an efficient, easy-to-use and flexible system to create NS2 gathers

3) Support the modern web and basic usability expectactions (e.g. realtime, phone and tablet friendly)

That's it

## Requirements

- node.js > 6.0

- MongoDB

## Run in development

```bash
npm install # Install deps

npm run watch # Compile and watch frontend assets

RANDOM_USER=true npm run dev # Run dev server, loading yourself as a random user
```

## Run in production

```bash
npm install # Install deps

npm start_production # Compile assets and run in production
```

## License

MIT Licensed
