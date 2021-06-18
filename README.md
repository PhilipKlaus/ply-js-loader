[![CircleCI](https://circleci.com/gh/PhilipKlaus/ply-js/tree/master.svg?style=svg)](https://circleci.com/gh/PhilipKlaus/ply-js/tree/master)
# ply-js

## Description
**ply-js** is a library for reading and writing PLY 3D files, completely written in Typescript.  

It targets to simplify PLY file loading while providing a deep insight into loaded data sets. This allows not only to render loaded point cloud and mesh data but also to edit, analyze and re-export them.

| Feature                   | Status    | Comment                                                   |
|---------------------------|-----------|-----------------------------------------------------------|
| Read ascii PLY files     | &#9989;   |                                                       |
| Read binary PLY files     | &#9989;   |                                                       |
| Common case helper for vertex data  | &#9989;   |                                                       |
| Common case helper for color data   | &#9989;   |                                                       |
| Common case helper for face data    | ⌛   | In Progress...                                            |
| Write and export PLY files   | ⌛   | In Progress...                                            |

## Examples

⌛ Work in progress ...

## Related projects
This project was heavily inspired by [happly](https://github.com/nmwsharp/happly), a header-only C++ reader/writer for the PLY files.
If you are searching for a simple PLY reader library for javascript with built-in [Three.js](https://threejs.org/) support, refer to [threejs-ply-loader](https://github.com/lanceschi/threejs-ply-loader).
