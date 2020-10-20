import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pagination'
})

export class PaginationPipe implements PipeTransform {
    transform(totalPages: number, selectedPage: number) {
        // ensure current page isn't out of range
        if (selectedPage < 1) {
          selectedPage = 1;
        } else if (selectedPage > totalPages) {
          selectedPage = totalPages;
        }
    
        let startPage: number, endPage: number;
        if (totalPages <= 5) {
          // less than 5 total pages so show all
          startPage = 0;
          endPage = totalPages - 1;
        } else {
          // more than 10 total pages so calculate start and end pages
          if (selectedPage <= 2) {
            startPage = 0;
            endPage = 4;
          } else if (selectedPage + 2 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
          } else {
            startPage = selectedPage - 2;
            endPage = selectedPage + 2;
          }
        }
        let pages = [];
        for (var i = 0; i < totalPages; i++) {
          if (i >= startPage && i <= endPage)
            pages.push(i);
        }
        return pages;
      }
}