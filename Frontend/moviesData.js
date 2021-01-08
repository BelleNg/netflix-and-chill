// import * as React from "react";
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function MoviesList() {
//   const [movies, setMovies] = useState([{id: "null", title: "undefined", poster_path: "/qHcn3PbjVHxBweDZxWpYH3JfugS.jpg"}]);
//   const [loading, setLoading] = React.useState("false")

//   React.useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const result = await axios(
//             'http://localhost:3000/movies',
//           );
//             console.log("this is from axios", result.data);
//             setMovies(result.data.movies);
            
//         } catch (error) {
//           setLoading("null");
//         }

//       };
//         fetchData();

//     }, []);

//   return (movies);
// }