## Jupyter Draw

### A Jupyter Extension to draw in output cells.

### Installation:
```bash
cd path/to/nbextensions/directory
git clone https://github.com/ash2shukla/Jupyter-draw.git

# Enable the extension from Jupyter panel or use following command

jupyter nbextension enable jupyter_draw/main

```

### Config:
- Config is optional.
- If no config given it will default to 5 line width, 300 canvas height and black line color.
- Write #jupyter_draw anywhere as a comment in python cell.

### Printing:
- Print Preview does not show canvas elements.
- To take a printout use ctrl + P (print utility of  web browser)

### Demo
![](assets/demo.gif)
