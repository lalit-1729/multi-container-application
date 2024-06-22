import React, { Component } from "react";
import axios from "axios";
import "./fibonacci-page.css";

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/values/all");
    this.setState({
      seenIndexes: seenIndexes.data
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("/api/values", {
      index: this.state.index,
    });
    this.setState({ index: "" });
    this.fetchValues();
    this.fetchIndexes();
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ index }) => index).join(", ");
  }

  renderValues() {
    const entries = [];
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For {key} value is {this.state.values[key]}
        </div>
      );
    }
    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <div className="outer-box">
          <p>Values from Postgres</p>
          <div className="box">
          <h4>Indexes you have worked with:</h4>
          {this.renderSeenIndexes()}
        </div>
        </div>

        <div className="outer-box">
          <p>Values from Redis</p>
          <div className="box">
            <h4>Calculated Values:</h4>
            {this.renderValues()}
          </div>
        </div>
      </div>
    );
  }
}

export default Fib;
