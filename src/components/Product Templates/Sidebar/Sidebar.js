import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Update as UpdateIcon, Delete as DeleteIcon } from "@material-ui/icons"

const list = (toggleDrawer, updateTemplate, templates) => {
    return (
        <div
            role="presentation"
            onClick={toggleDrawer('', false)}
            onKeyDown={toggleDrawer('', false)}
        >
            <List>
                {templates.map((obj, index) => (
                    <ListItem button key={index}>
                        <ListItemText onClick={(e) => updateTemplate(obj._id)} primary={obj.name} />
                        <ListItemIcon><DeleteIcon /></ListItemIcon>
                        <ListItemIcon onClick={(e) => updateTemplate(obj._id)}><UpdateIcon /></ListItemIcon>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

const Sidebar = ({anchor, toggleDrawer, updateTemplate, templates}) => {
    return (
        <Drawer open={anchor} onClose={toggleDrawer('', false)}>
            {list(toggleDrawer, updateTemplate, templates)}
        </Drawer>
    )
}

export default Sidebar;
