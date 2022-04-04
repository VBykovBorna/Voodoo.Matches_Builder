# Playable Template
Starting point for in-house playable ads.

# Setup
Start by cloning this repo onto local computer:
```
git clone https://github.com/MassiveHeights/Playable.Template
cd Playable.Template
npm i
```

# Development server
This template provides ability to run development server on port 3000 to do so run `npm start` in the terminal 
then open a browser and navigate to `http://127.0.0.1:3000`.

#Voodoo dashboard
Dashboard test site: https://icream-devtool.s3-eu-west-1.amazonaws.com/index.html

To test creative on the dashboard, please run 'npm run build:voodoo' and upload 'code.js', 'template.ice' and 'builder.html' files to the test site.

#Run builds
 - npm run start - runs development server (for development only). This build uses fake Voodoo API realization.
 - npm run build - create development build (for development only). This build uses fake Voodoo API realization.
 - npm run build:inline - create inlined development build (for development only). This build uses fake Voodoo API realization.
 - npm run build:voodoo - creates Voodoo ICE dashboard build.

#Voodoo template notes
 /* to be updated
