import React from "react";
import ReactPaginate from "react-paginate";
const Paginationcomponent = ({ pagecount, onpress }) => {
  const handlePageClick = (data) => {
    onpress(data.selected + 1);
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        marginPagesDisplayed={1}
        pageRangeDisplayed={1}
        pageCount={pagecount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="active"
        previousClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        forcePage={0}
      />
    </div>
  );
};

export default Paginationcomponent;
