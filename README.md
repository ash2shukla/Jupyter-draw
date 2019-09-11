## Jupyter Draw
--
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
- If no config given it will default to 5 line width, 300 canvas height and maroon line color.
- The cell where #jupyter_draw is given must not have anything except the **#jupyter_draw=config**

### Demo
![](assets/demo.gif)
