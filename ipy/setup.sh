#!/bin/sh

#############################################################################################################
# ubuntu install
#############################################################################################################
sudo apt-get install python-pip python-dev build-essential 
sudo pip install --upgrade pip 
sudo pip install --upgrade virtualenv 

sudo apt-get install ipython
sudo apt-get install ipython-notebook
sudo apt-get install ipython-qtconsole
echo "run : #] ipython notebook --ip 192.168.0.X"

sudo apt-get install python-pandas
sudo apt-get install python-numpy
sudo apt-get install python-scipy
sudo apt-get install python-matplotlib
sudo apt-get install cython
cd apachelog-1.0/ && sudo python setup.py install

sudo pip install runipy
echo "run : #] runipy notebook.ipynb"

#############################################################################################################
# centOs install
#############################################################################################################
# rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# yum install ipython
# curl -k -O https://bootstrap.pypa.io/get-pip.py
# python get-pip.py
# 
# pip install notebook
# pip install qtconsole
# pip install pandas
# pip install scipy
# pip install matplotlib
# pip install cython
# pip install runipy
#
# cd apachelog-1.0/ && sudo python setup.py install
