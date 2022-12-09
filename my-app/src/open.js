import './App.css';
import React, { useState, useEffect } from 'react';



const App = () => {
  const [lists, setLIsts] = useState([]);
  useEffect(() => {
    fetch('/api/open/display-lists', {
      method: "GET" // default, so we can ignore
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        data.forEach(e => {
         console.log(e)
        })
        setLIsts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="lists-container">
      {lists.map((post) => {
        return (
          <div className="list-box" key={post.creator}>
            <h2 className="list-title">{post.list_name}</h2>
            <p className="list-info">{post.track_list_count}# of tracks - {post.list_duration} mins : Rating of {post.rating}</p>
            <button className="list-button"> Expand</button> 
          </div>
        );
      })}
    </div>
  );
};

export default App;
