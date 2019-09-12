import setuptools

setuptools.setup(
    name="jupyter-draw",
    version='0.1.0',
    url="https://github.com/ash2shukla/Jupyter-draw",
    author="Ashish Shukla",
    description="Jupyter extension to draw in output cells",
    packages=setuptools.find_packages(),
    install_requires=[
        'psutil',
        'notebook',
    ],
    package_data={'jupyter_draw': ['static/*']},
)