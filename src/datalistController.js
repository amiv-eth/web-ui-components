import m from 'mithril';
import Stream from 'mithril/stream';
import debounce from './debounce';

/** Controller for a list of data from a python-eve REST-API. */
export default class DatalistController {
  /**
   * @param {function} get   function(query, search),
   *   performs a get request to some resource with the given query and search. Search is a
   *   simple string that has to be defined by the get-function to perform any kind of
   *   string-matching that makes sense for the represented data
   * @param {object} query   any initial query
   */
  constructor(get, query = {}) {
    this.get = get;
    this.query = query || {};
    this.search = null;
    this.filter = null;
    this.sort = null;
    // state pointer that is counted up every time the table is refreshed so
    // we can tell infinite scroll that the data-version has changed.
    this.stateCounter = Stream(0);
    this.refresh();
    this.debouncedSearch = debounce((search) => {
      this.setSearch(search);
      this.refresh();
      m.redraw();
    }, 100);
    // keep track of the total number of pages
    this.totalPages = null;
  }

  /** Refresh the whole list */
  refresh() {
    this.stateCounter(this.stateCounter() + 1);
  }

  infiniteScrollParams(item) {
    return {
      item,
      pageData: (pageNum) => this.getPageData(pageNum),
      pageKey: (pageNum) => `${pageNum}-${this.stateCounter()}`,
      maxPages: this.totalPages ? this.totalPages : undefined,
    };
  }

  /**
   * Return the data of a specific page.
   *
   * @param      {int}   pageNum - The page number
   * @return     {Promise}  The page data as a list.
   */
  getPageData(pageNum) {
    // for some reason this is called before the object is instantiated.
    // check this and return nothing
    const query = Object.assign({}, this.query);
    query.max_results = 10;
    query.page = pageNum;
    query.where = Object.assign({}, this.filter, this.query.where);
    query.sort = this.sort;
    // remove where again if it is empty
    if (Object.keys(query.where).length === 0) delete query.where;

    return new Promise((resolve) => {
      this.get(query, this.search).then((data) => {
        // update total number of pages
        this.totalPages = Math.ceil(data._meta.total / 10);
        resolve(data._items);
      });
    });
  }

  /**
   * Get all available pages
   */
  getFullList() {
    return new Promise((resolve) => {
      // get first page to refresh total page count
      this.getPageData(1).then((firstPage) => {
        const pages = { 1: firstPage };
        // save totalPages as a constant to avoid race condition with pages added during this
        // process
        const { totalPages } = this;

        if (totalPages <= 1) {
          resolve(firstPage);
        } else {
          // now fetch all the missing pages
          Array.from(new Array(totalPages - 1), (x, i) => i + 2).forEach((pageNum) => {
            this.getPageData(pageNum).then((newPage) => {
              pages[pageNum] = newPage;
              // look if all pages were collected
              const missingPages = Array.from(new Array(totalPages), (x, i) => i + 1)
                .filter((i) => !(i in pages));
              if (missingPages.length === 0) {
                // collect all the so-far loaded pages in order (sorted keys)
                // and flatten them into 1 array
                resolve([].concat(...Object.keys(pages).sort().map((key) => pages[key])));
              }
            });
          });
        }
      });
    });
  }

  setSearch(search) {
    this.search = search;
  }

  /**
   *  Set Filters applied to the query.
   *  Filters a part of the 'where'-query that can be set independently from the standard where
   *  query. The main usecase are filters on the list-items that can be quickly turned on and
   *  off without affecting the general query settings.
   * @param {Object} filters - filters object, in the python-eve format of a where-query.
   */
  setFilter(filter) {
    this.filter = filter;
    this.refresh();
  }

  setQuery(query) {
    this.query = Object.assign({}, query);
    this.refresh();
  }

  setSort(sort) {
    this.sort = sort;
    this.refresh();
  }
}
