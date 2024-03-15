Install
=======

This package and the build results are available for *npm*, *pnpm* and *yarn*:

.. code-block:: sh

    npm i -S @cyclonedx/cyclonedx-library
    pnpm add @cyclonedx/cyclonedx-library
    yarn add @cyclonedx/cyclonedx-library

You can install the package from source,
which will build automatically on installation:

.. code-block:: sh

    npm i -S github:CycloneDX/cyclonedx-javascript-library
    pnpm add github:CycloneDX/cyclonedx-javascript-library
    yarn add @cyclonedx/cyclonedx-library@github:CycloneDX/cyclonedx-javascript-library # only with yarn-2


Optional Dependencies
---------------------

Some dependencies are optional.
See the shipped ``package.json`` for version constraints.

* Serialization to XML on *Node.js* requires any of:
    * `xmlbuilder2 <https://www.npmjs.com/package/xmlbuilder2>`_
* Validation of JSON on _Node.js_ requires all of:
    * `ajv <https://www.npmjs.com/package/ajv>`_
    * `ajv-formats <https://www.npmjs.com/package/ajv-formats>`_
    * `ajv-formats-draft2019 <https://www.npmjs.com/package/ajv-formats-draft2019>`_
* Validation of XML on _Node.js_ requires all of:
    * `libxmljs2 <https://www.npmjs.com/package/libxmljs2>`_
    * the system must meet the requirements for `node-gyp <https://github.com/TooTallNate/node-gyp#installation>`_
