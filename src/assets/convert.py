# coding=utf-8

import os, json
from PIL import Image

IMAGES = []

for root, dirs, files in os.walk('./original'):
    for f in files:
      name, ext = os.path.splitext(f)
      if ext == '.png':
        IMAGES.append((root.replace('/original', '/') + f, Image.open(root + '/' + f)))

for entity in IMAGES:
  path = entity[0]
  image = entity[1]
  (w, h) = image.size
  image = image.resize((414, int(414 / w * h)))
  image.save(path)
