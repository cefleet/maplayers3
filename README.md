maplayers3
==========
First thing add bootstrap back. I don't want to do no styling!

TODO List to get the core of Maplayers 3 to where maplayers 2 is:
Client Side
1. Style Layer control
2. Edit attribute (WFS send will be needed for this, but do the client side first)
3. Style View/Edit attribute
4. Add Legend (make it much better this time though)
5. login (client side)
6. Search (client side)
7. navigation
8. Square Select (polygon select as well?)

Server Side
1. User Control (login and other parts)
2. WFS server getFeature (basic bbox collection allow client side filtering)
3. WFS server saveFeature (Non-standard)
4. Search backend (hopefully via WFS server if not then we will have to do a workaround)

New or Changed Features
1. GUI layer creation (with a style maker and image uploader)
2. Client Side filtering (should be considerablly faster)

Modules
1. Inspection Module (make it awesome this time)