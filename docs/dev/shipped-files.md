# Shipped files

Of cause, we ship the build results (JavaScript and type definitions).

We also ship our sources (TypeScript), so that downstream users can work with them directly with own compilers/builders/packers. 
And we ship all the build instructions we used.  
Background: our source code requires some special TypeScript compiler options; downstream users might need our special build options, when they work with our shipped sources.  
We manage our shipped files in a [`.npmignore`](../../.npmignore) blacklist.
