# Expack App Generator

Full stack application generator 

## Generators Included

- yo expack -> scaffolding
- yo expack:database -> adds database
- yo expack:apps -> adds subapp
- yo expack:destroy -> [for development only] destroys your app. Muahahaha! 

## TODO

##### expack:database generator

- Use uglifyjs to beautify config after update.
- Add support for mongodb.
- Update package.json with selected database dependencies.
- Generate knexfile.js if a relation db is selected.

##### Generators

- Add generator `expack:controller` (generate controller)
- Add generator `expack:model` (genereate model)
- Add generator `expack:validator` (generate validation middleware)
- Add generator `expack:auth` scaffold user authentication (passport)
