const maxPerPage = 25;


const getPagination = (page, size) => {
    console.log(page, size)
    const limit = size ? +size : maxPerPage;  // по умолчанию количество записей на страницу
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
  };

  export {getPagination}

  const getPagingData = (data, page, limit) => {
    const  totalRecords = Number(data[1].rows[0].count);
    // const { rows: data } = data[0];
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalRecords / limit);
    const perPage = limit;
    const  pagination = { totalRecords, totalPages, currentPage, perPage, maxPerPage };
    return pagination
  };

  export {getPagingData}
