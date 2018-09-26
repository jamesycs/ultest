import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './page.css';
import axios from "axios";
import _ from "lodash";
const todoItems = [];
// todoItems.push({index: 1, value: "learn react", done: false});
// todoItems.push({index: 2, value: "Go shopping", done: true});
// todoItems.push({index: 3, value: "buy flowers", done: true});

// 

class TodoList extends React.Component {
  render() {
    const items = this.props.items.map((item, index) => {
      return (
        <TodoListItem key={index} item={item} index={index} removeItem={this.props.removeItem} markTodoDone={this.props.markTodoDone} />
      );
    });
    return (
      <ul className="list-group"> {items} </ul>
    );
  }
}

class TodoListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
  }
  onClickClose() {
    const index = parseInt(this.props.index);
    this.props.removeItem(index);
  }
  onClickDone() {
    const index = parseInt(this.props.index);
    this.props.markTodoDone(index);
  }
  render() {
    const todoClass = this.props.item.done ?
      "done" : "undone";
    return (
      <li className="list-group-item ">
        <div className={todoClass}>
          <span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={this.onClickDone}></span>
          {this.props.item.value}
          <button type="button" className="close" onClick={this.onClickClose}>&times;</button>
        </div>
      </li>
    );
  }
}

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.refs.itemName.focus();
  }
  onSubmit(event) {
    event.preventDefault();
    const newItemValue = this.refs.itemName.value;

    if (newItemValue) {
      this.props.addItem({ newItemValue });
      this.refs.form.reset();
    }
  }
  render() {
    return (
      <form ref="form" onSubmit={this.onSubmit} className="form-inline">
        <input type="text" ref="itemName" className="form-control" placeholder="add a new todo..." />
        <button type="submit" className="btn btn-default">Add</button>
      </form>
    );
  }
}

class TodoHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      city: "",
      temp: "",
      date: "",
      condition: ""
    };
    this.weatherApi = "http://api.openweathermap.org/data/2.5/forecast?q=Hong+Kong&mode=json&units=metric&cnt=7&appid=42664c60d362c553900515bbcb52214d"
  }
  componentDidMount() {
    axios.get(this.weatherApi)
      .then((res) => {
        // console.log('====================================');
        // console.log(res.data);
        // console.log('====================================');
        this.setState({
          weather: res.data,
          city: res.data.city.name,
          temp: res.data.list[0].main.temp_max,
          date: res.data.list[0].dt_txt.slice(0, 10),
          condition: res.data.list[0].weather[0].main
        });
      });
  }
  renderWeather() {
    if (_.isEmpty(this.state.weather, true)) {
      return <li >fetching data</li>
    }
    /* map data returned, limited by 4  */
    // return _.map(this.state.weather, t => {
    //   return (
    //     <li key="1">
    //       {t.city}
    //     </li>
    //   )
    // });
    return (
      <div className="todoHead">
        <ul>
          <li>        <img src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Status-weather-showers-scattered-night-icon.png"></img></li>
        </ul>
        <ul>
          <li>{this.state.city}</li>
          <li>{this.state.date}</li>
          <li>{this.state.temp}°C</li>
          <li>{this.state.condition}</li>
        </ul>
      </div>
    );
  }
  render() {
    // const renderW = this.renderW();

    console.log(this.state);

    return (
      <div className="todol">
        <h2>Weather Condition:</h2>
        {this.renderWeather()}
        <hr />
        <h2>Todo list</h2>
      </div>);
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.markTodoDone = this.markTodoDone.bind(this);
    this.state = { todoItems: todoItems };
  }
  addItem(todoItem) {
    todoItems.unshift({
      index: todoItems.length + 1,
      value: todoItem.newItemValue,
      done: false
    });
    this.setState({ todoItems: todoItems });
  }
  removeItem(itemIndex) {
    todoItems.splice(itemIndex, 1);
    this.setState({ todoItems: todoItems });
  }
  markTodoDone(itemIndex) {
    const todo = todoItems[itemIndex];
    todoItems.splice(itemIndex, 1);
    todo.done = !todo.done;
    todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
    this.setState({ todoItems: todoItems });
  }
  render() {
    return (
      <div id="main">
        <TodoHeader />
        <TodoList items={this.props.initItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone} />
        <TodoForm addItem={this.addItem} />
      </div>
    );
  }
}

ReactDOM.render(<TodoApp initItems={todoItems} />, document.getElementById('app'));