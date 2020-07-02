import React, { Component } from "react";
import "./App.css";
import Spinner from "./components/spinner/Spinner";

class App extends Component {
  myref;
  intersectionObserver;

  constructor(props) {
    super(props);
    this.myref = React.createRef();
    this.state = {
      newStories: [],
      loading: true,
      hasMore: false,
      renderedIndexes: 0,
      pagination: 0,
      isLastShowing: false
    };
    this.intersectionObserver = new IntersectionObserver((entries) => {
      const ratio = entries[0].intersectionRatio;
      if ( ratio > 0 && this.state.hasMore) {
        console.log("last div showing and has more to fetch");
        // this.setState({ isLastShowing: true })
        this.fetchNewStories(this.state.renderedIndexes + 50);
      }
    });
  }

  // componentDidUpdate = async () => {
  //   console.log("componentDidUpdate ran")
  //   this.fetchNewStories(this.state.renderedIndexes + 50);
  //   this.setState({ isLastShowing: false })
  // }

  componentDidMount = async () => {
    await this.fetchNewStories(50);
    this.intersectionObserver.observe(this.myref.current);
  };

  componentWillUnmount = () => {
    this.intersectionObserver.disconnect();
  };

  API = "https://hacker-news.firebaseio.com/v0/";

  fetchArticle = async (articleID) => {
    const article = await fetch(
      `${this.API}/item/${articleID}.json?print=pretty`,
      {
        method: "Get",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    return article;
  };

  fetchArticleIds = async () => {
    const articleIds = await fetch(`${this.API}/newstories.json?print=pretty`, {
      method: "Get",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    return articleIds;
  };

  // call the fetchNewStories with a num para so
  // you know where to slice fetches
  fetchNewStories = async (num) => {
    console.log(num);
    const sliceBegin =
      this.state.renderedIndexes === 0 ? 0 : this.state.renderedIndexes;
    const sliceEnd = num;
    this.setState({ isLoading: true });
    console.log("begin:", sliceBegin);
    console.log("end:", sliceEnd);
    const newStoriesIds = await this.fetchArticleIds();
    const getStories = await Promise.all(
      newStoriesIds
        .slice(sliceBegin, sliceEnd)
        .map((id) => this.fetchArticle(id))
    );
    let hasMore =
      newStoriesIds.length > this.state.renderedIndexes ? true : false;

    // filter all falsy values
    const newStories = getStories.filter(Boolean);

    // update list whenever a fetch is made
    this.setState((prevState) => {
      const updatedNewStories = [...prevState.newStories];
      updatedNewStories.push(...newStories);
      return {
        newStories: updatedNewStories,
        isLoading: false,
        hasMore,
        renderedIndexes: num,
      };
    });
    // console.log("items on new stories:", newStories);
    // console.log("ids", newStoriesIds);
    // console.log("has more", hasMore);
  };

  render() {
    console.log("new stories in state:", this.state.newStories);
    console.log("renderedIndexes:", this.state.renderedIndexes);

    const content = 
      this.state.newStories.map((article, i) => {
        if (this.state.newStories.length === i + 1) {
          console.log("last div title:", article.title);
          console.log("reference:", this.myref.current);
          return (
            <div key={i} ref={this.myref} className="news__story-Div">
              <p>posted by {" "} {article.by}</p>
              <h4 className="news__story-Div-article">
                <a href={article.url} rel="noopener">
                  {article.title}
                </a>
              </h4>
              
              <p>posted at{" "} {new Date(article.time * 1000).toLocaleString()}</p>
            </div>
          );
        } else {
          return (
            <div key={i} className="news__story-Div">
              <p>posted by {" "} {article.by}</p>
              <h4 className="news__story-Div-article">
                <a href={article.url} rel="noopener">
                  {article.title}
                </a>
              </h4>
              <p>posted at{" "} {new Date(article.time * 1000).toLocaleString()}</p>
            </div>
          );
        }
      })

    return (
      <div className="App">
        <h1 className="App__title">News App</h1>
        {this.state.isLoading && <Spinner />}
        {!this.state.isLoading && content}
      </div>
    );
  }
}

export default App;
