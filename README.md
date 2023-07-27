# Planter  
A CLI tool for building React & React-native applications.   

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/team-octoo/planter-cli/graphs/commit-activity) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)  

This CLI   
- sets up a basic folder structure (of your choice)  
- add commonly used packages  
- give command to easely create state, components & other functions  
- writes documentation for proposed structures & packages  

## Installation  
npm install -g @team-octoo/planter

## Usage  
After installing this package globally, run command "planter -h" in your command-line terminal.    
Commands should be run in the root-folder of a react or react-native installation.   

"planter" is the script-command which initialises the CLI.   

## Information    
This package has been created by the lovely people at [Octoo](https://octoo.be)  

Found a bug or want to extend this package?  
- Create an issue on Github  
- Or even better, change the code and submit a pull request and we'll have a look asap.  

## Available choices & packages  
When initialising planter on a new or existing project, these are the choices to be made.  

### Component structure  
- BEP (Basics, Elements, Pages)  
- Atomic components  
- Custom (Define your own folder structure in planter.config.json)   

### Lay-out  
- css   
- css-modules   
- scss    
- scss-modules   
- styled-components   
- custom (self install)  

### Packages   
- Error-boundary  
- Mock service worker  
- React-router  
- Wouter   
- Patch-package   
- Redux  
- Zustand  
- i18next  
- Axios  
- Cypress  
- Prop-types   

## Config

Planter cli has a config file named `./planter.config.json`.

| Key            | Description                                                             | Type                                                 |
|----------------|-------------------------------------------------------------------------|------------------------------------------------------|
| `version`      | Version of the planter cli                                              | `0 \| 1`                                             |
| `name`         | Name of the application                                                 | `string`                                             |
| `library`      | Type of react library                                                   | `'react' \| 'react-native'`                          |
| `installer`    | npm or yarn                                                             | `'npm' \| 'yarn'`                                    |
| `hasTs`        | Wether or not typescript is used                                        | `boolean`                                            |
| `layout`       | Type of stylesheets                                                     | `'css' \| 'css modules' \| 'sass' \| 'sass modules'` |
| `packages`     | Installed packages (asked on init)                                      | `string[]`                                           |
| `components`   | Defines options for `plant:component` command (subfolders are possible) | `object`                                             |
| `structure`    | Type of component structure                                             | `'BEP (recommended)' \| 'Atomic' \| 'Custom'`        |
| `usePropTypes` | Older way of using prop types without typescript                        | `boolean`                                            | 
