import React from "react";
import ReactPaginate from "react-paginate";
const Paginationcomponent = ({ getpage, totalPage, currentPage }) => {
  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    getpage(selectedPage);
    console.log(selectedPage);
  };
  const pageCount = totalPage;

  return (
    <div className="d-flex justify-content-center mt-3">
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        pageCount={pageCount}
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
        forcePage={currentPage}
      />
    </div>
  );
};

export default Paginationcomponent;
