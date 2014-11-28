#!/bin/sh

sudo apt-get install python-pip python-dev build-essential 
sudo pip install --upgrade pip 
sudo pip install --upgrade virtualenv 

sudo apt-get install ipython
sudo apt-get install ipython-notebook
sudo apt-get install ipython-qtconsole
echo "run : #] ipython notebook"

sudo apt-get install python-pandas
sudo apt-get install python-numpy
sudo apt-get install python-scipy
sudo apt-get install python-matplotlib
sudo apt-get install cython
cd apachelog-1.0/ && sudo python setup.py install

sudo pip install runipy
echo "run : #] runipy notebook.ipynb"
