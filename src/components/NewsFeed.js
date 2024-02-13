import React, { useState, useEffect, useReducer } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer, MDBTable, MDBTableBody, MDBTableHead, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBIcon } from 'mdb-react-ui-kit';


const initialState = {
  loading: true,
  error: null,
  news: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        news: action.payload.data, // Access the 'data' property of the payload
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};


  const NewsFeed = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');
    const itemsPerPage = 5; // Define itemsPerPage constant
    const totalPages = Math.ceil(state.news.length / itemsPerPage);
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <MDBPaginationItem key={i} active={page === i}>
          <MDBPaginationLink onClick={() => setPage(i)}>{i}</MDBPaginationLink>
        </MDBPaginationItem>
      );
    }

  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const apiKey = 'HI7ZK0u29SFfC69iPQenzcqG9FhNmbBOIoYtTeQT';
          const itemsPerPage = 5; // Number of items per page
          const totalPages = Math.ceil(state.news.length / itemsPerPage);
          const apiUrl = `https://api.stockdata.org/v1/news/all?symbols=TSLA,AMZN,MSFT&filter_entities=true&language=en&page=${page}&limit=${itemsPerPage}&filter=${filter}`;
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${apiKey}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
      };
  
      fetchData();
    }, [page, filter]);

    const handlePreviousPage = () => {
      setPage(page - 1);
    };
  
    const handleNextPage = () => {
      setPage(page + 1);
    };
  
    const handleFilterChange = (event) => {
      setFilter(event.target.value);
    };
  
    return (
        <MDBContainer className="py-5">
          <MDBCard className="d-flex" style={{ width: "48rem" }}>
            <MDBCardBody>
              <MDBTable hover forum responsive className="text-center">
                <MDBTableHead>
                  <tr>
                    <th></th>
                    <th className="text-left">Topic</th>
                    <th>Comments</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
  {state.loading ? (
    <tr>
      <td colSpan="3">Loading...</td>
    </tr>
  ) : state.error ? (
    <tr>
      <td colSpan="3">{state.error}</td>
    </tr>
  ) : state.news.length === 0 ? (
    <tr>
      <td colSpan="3">No news available</td>
    </tr>
  ) : (
    state.news.map((item, index) => (
      <tr key={index}>
        <td scope="row" className="text-nowrap">
          {/* Your upvote/downvote buttons */}
        </td>
        <td className="text-start">
          <a href={item.url} className="font-weight-bold blue-text">{item.title}</a>
          <div className="my-2">
            <a href="#" className="blue-text">
              <strong>{item.source}</strong>
            </a>
            {/* Other badges and metadata */}
            <span>{item.published_at}</span>
          </div>
        </td>
        <td>
          <a href="#" className="text-dark">
            <span>{item.comments}</span>
            <MDBIcon fas icon="comments" className="ms-1" />
          </a>
        </td>
      </tr>
    ))
  )}
</MDBTableBody>

              </MDBTable>
              <div className="d-flex justify-content-center">
                <nav className="my-3 pt-2">
                <MDBPagination circle className="mb-0">
  <MDBPaginationItem>
    <MDBPaginationLink
      href="#"
      tabIndex={-1}
      aria-disabled="true"
      onClick={handlePreviousPage}
      disabled={page === 1}
    >
      Previous
    </MDBPaginationLink>
  </MDBPaginationItem>
  {paginationItems}
  <MDBPaginationItem>
    <MDBPaginationLink
      href="#"
      onClick={handleNextPage}
      disabled={page === totalPages}
    >
      Next
    </MDBPaginationLink>
  </MDBPaginationItem>
</MDBPagination>
                </nav>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      );
    };
  
  export default NewsFeed;