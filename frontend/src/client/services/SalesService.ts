/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Sale } from "../models/Sale";
import type { SaleCreate } from "../models/SaleCreate";
import type { SaleUpdate } from "../models/SaleUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request, requestWithHeaders } from "../core/request";

export class SalesService {
  /**
   * Get Multi
   * Get list of sales.
   *
   * Args:
   * response (Response): Response.
   * queries (SaleQueries, optional): Sale queries.
   * sort (list[str], optional): Order parameters.
   * sale_dao (SaleDAO, optional): Sale DAO.
   *
   * Returns:
   * list[Sale]: List of sales.
   * @param skip
   * @param limit
   * @param game
   * @param platform
   * @param createdByUser
   * @param sort
   * @returns Sale Successful Response
   * @throws ApiError
   */
  public static getMulti(
    skip?: number,
    limit: number = 100,
    game?: string,
    platform?: string,
    createdByUser?: string,
    sort?: string
  ): CancelablePromise<Array<Sale>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/sales/",
      query: {
        skip: skip,
        limit: limit,
        game: game,
        platform: platform,
        created_by_user: createdByUser,
        sort: sort,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  public static getMultiWithHeaders(
    skip?: number,
    limit: number = 100,
    game?: string,
    platform?: string,
    createdByUser?: string,
    sort?: string
  ) {
    return requestWithHeaders<Sale[]>(OpenAPI, {
      method: "GET",
      url: "/api/sales/",
      query: {
        skip: skip,
        limit: limit,
        game: game,
        platform: platform,
        created_by_user: createdByUser,
        sort: sort,
      },
      errors: {
        422: `Validation Error`,
      },
      responseHeader: "x-total-count",
    });
  }

  /**
   * Create
   * Create a new sale
   *
   * Args:
   * sale (SaleCreate): Sale data.
   * sale_dao (SaleDAO): Sale DAO.
   * current_superuser (User): Current superuser.
   *
   * Returns:
   * Sale: A new sale.
   * @param requestBody
   * @returns Sale Successful Response
   * @throws ApiError
   */
  public static create(requestBody: SaleCreate): CancelablePromise<Sale> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/sales/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Multi
   * Delete multiple companies.
   *
   * Args:
   * sale_ids (list[UUID]): Sale ids.
   * sale_dao (SaleDAO, optional): Sale DAO.
   * current_superuser (User, optional): Current superuser.
   *
   * Returns:
   * None: None.
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public static deleteMulti(requestBody: Array<string>): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/sales/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get
   * Get sale by id.
   *
   * Args:
   * sale_id (UUID): Sale ID.
   * sale_dao (SaleDAO): SaleDAO
   *
   * Returns:
   * Sale: Sale
   * @param saleId
   * @returns Sale Successful Response
   * @throws ApiError
   */
  public static get(saleId: string): CancelablePromise<Sale> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/sales/{sale_id}",
      path: {
        sale_id: saleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete
   * Delete company.
   *
   * Args:
   * sale_id (UUID): Sale id.
   * sale_dao (CompanyDAO, optional): Sale DAO.
   * current_superuser (User, optional): Current superuser.
   *
   * Returns:
   * None: None.
   * @param saleId
   * @returns void
   * @throws ApiError
   */
  public static delete(saleId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/sales/{sale_id}",
      path: {
        sale_id: saleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update
   * Update sale.
   *
   * Args:
   * sale_id (UUID): Sale id.
   * sale (SaleUpdate): Sale data.
   * sale_dao (SaleDAO, optional): Sale DAO.
   * current_superuser (User, optional): Current superuser.
   *
   * Returns:
   * Sale: Sale.
   * @param saleId
   * @param requestBody
   * @returns Sale Successful Response
   * @throws ApiError
   */
  public static update(saleId: string, requestBody: SaleUpdate): CancelablePromise<Sale> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/sales/{sale_id}",
      path: {
        sale_id: saleId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
