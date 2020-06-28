import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPwgvIUvbiqNTlJdZZWoL9d2SRCkkht-M",
  authDomain: "infohe-51752.firebaseapp.com",
  databaseURL: "https://infohe-51752.firebaseio.com",
  projectId: "infohe-51752",
  storageBucket: "infohe-51752.appspot.com",
  messagingSenderId: "154670197632",
  appId: "1:154670197632:web:1a503b6d66b898c4f1af65",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
} from "@material-ui/core";
import  {
  ExpandMore
} from "@material-ui/icons";

const categories = [
  {
    "_id": "5ef5e95f6d957a00173e32b5",
    "name": "Automobile",
    "path": "automobile",
    "parent_id": null,
    "__v": 0
  },
  {
    "_id": "5ef5e9c76d957a00173e32b8",
    "name": "Coupe",
    "path": "coupe",
    "parent_id": "5ef5e98b6d957a00173e32b6",
    "__v": 0
  },
  {
    "_id": "5ef5e9d26d957a00173e32b9",
    "name": "SUV",
    "path": "suv",
    "parent_id": "5ef5e98b6d957a00173e32b6",
    "__v": 0
  },
  {
    "_id": "5ef5e9de6d957a00173e32ba",
    "name": "Sedan",
    "path": "sedan",
    "parent_id": "5ef5e98b6d957a00173e32b6",
    "__v": 0
  }
]

const acategories = [
  {
    "_id": "5ef5e9976d957a00173e32b7",
    "name": "Bikes",
    "path": "bikes",
    "parent_id": "5ef5e95f6d957a00173e32b5",
    "__v": 0
  },
  {
    "_id": "5ef5e98b6d957a00173e32b6",
    "name": "Cars",
    "path": "cars",
    "parent_id": "5ef5e95f6d957a00173e32b5",
    "__v": 0
  },
]

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

// const classes = useStyles();
class App extends Component {
  constructor (props) {
    super(props)
    this.state={}
    this.getCategory = this.getCategory.bind(this)
  }

  getCategory (parent_id) {
    axios.get("http://localhost:4000/categories/parent/"+parent_id)
      .then(({data}) => {
        console.log(data)
        data.map(({name, _id}) => {
          let node = document.createElement('li')
          let textNode = document.createTextNode(`${name}`)
          node.appendChild(textNode)
          node.setAttribute('key', _id)
          node.setAttribute(`onClick`, `{() => this.getCategory(${_id})}`)
          let parentNode = document.getElementById(parent_id)
          parentNode.appendChild(node)
        })
      })
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
        <ul className="list-of-categories">
          {categories.map(({ name, _id }) => {
            return (
              <li id={_id} key={_id}>
                <p onClick={() => this.getCategory(_id)}>{name}</p>
              </li>
            );
            })}
        </ul>
        <Button variant="contained" color="primary">
          Create New Category
        </Button>
      </header>
    </div>
  );
  }
}

export default App;
