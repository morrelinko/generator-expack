# Expack App Generator

Full stack application generator with multi application feature...

## Installation

Install Yeoman

    $ npm install -g yo
    
Install Expack generator

    $ npm install -g generator-expack
    
## Usage

First scaffold an app using command below
    
    $ yo expack
    
### Create app

    $ yo expack:apps web
    $ npm install
    
Launch your app using

    $ node bin/serve web
    
### Adding database to your application

    $ yo expack:database
    
## Concepts

### Application Types

1. web - selecting this type will setup a conventional web app (flash, sessions, views).
2. api - selecting this will quickly setup application for a resourceful api.
3. custom - implement custom app. do the hard work yourself.

### Application Modes

#### standalone 

- Basically an express app `let app = express()`;
- Runs on its own using `node bin/serve <name>`

#### mounted 

- basically a mini app `let app = express.Router()`;
- Cannot run on its own. Requires mounting on a standalone app

## Generators Included

- yo expack -> scaffolding
- yo expack:database -> adds database
- yo expack:apps -> adds subapp
- yo expack:destroy -> [for development only] destroys your app. Muahahaha! 

## TODO

##### expack:database generator

- Add support for mongodb.
- Generate knexfile.js if a relation db is selected.

##### Generators

- Add generator `expack:handler` (generate handler (controller))
- Add generator `expack:model` (genereate model)
- Add generator `expack:validator` (generate validation middleware)
- Add generator `expack:auth` scaffold user authentication (passport)

##### generator expack:app 

- complete api app stub
