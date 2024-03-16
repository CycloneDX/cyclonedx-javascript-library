from json import load as json_load
from os.path import dirname, join


project = 'CycloneDX JavaScript Library'
copyright = 'Copyright (c) OWASP Foundation'
author = 'Jan Kowalleck'

with open(join(dirname(__file__), '..', 'package.json'), 'rt') as package:
    release = json_load(package)['version']

# -- General configuration ---------------------------------------------------

extensions = [
    "sphinx_rtd_theme",
    "m2r2"
]

source_suffix = ['.rst', '.md']



# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
# see https://www.sphinx-doc.org/en/master/usage/configuration.html#confval-exclude_patterns
exclude_patterns = [
    'api',
    'processes',  'dev', # internal docs
    '_build',  # build target
    '.*', '**/.*',  # dotfiles and folders
    'Thumbs.db', '**/Thumbs.db',
]


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'


html_extra_path = ['api']
