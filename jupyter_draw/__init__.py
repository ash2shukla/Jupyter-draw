def _jupyter_server_extension_paths():
    return [{
        'module': 'jupyter_draw',
    }]

def _jupyter_nbextension_paths():
    return [{
        "section": "notebook",
        "dest": "jupyter_draw",
        "src": "static",
        "require": "static/main"
    }]

def load_jupyter_server_extension(nbapp):
    pass