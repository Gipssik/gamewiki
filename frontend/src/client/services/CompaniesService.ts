/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Company } from "../models/Company";
import type { CompanyCreate } from "../models/CompanyCreate";
import type { CompanyUpdate } from "../models/CompanyUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request, requestWithHeaders } from "../core/request";
import { CompanyGamesStatistics } from "../models/CompanyGamesStatistics";
import { CompanyFoundationStatistics } from "../models/CompanyFoundationStatistics";

export class CompaniesService {
  /**
   * Get Multi
   * Get list of companies.
   *
   * Args:
   * response (Response): Response.
   * queries (CompanyQueries, optional): Query parameters.
   * sort (list[str], optional): Order parameters.
   * company_dao (CompanyDAO, optional): Company DAO.
   *
   * Returns:
   * list[Company]: List of companies.
   * @param skip
   * @param limit
   * @param title
   * @param createdByUser
   * @param sort
   * @returns Company Successful Response
   * @throws ApiError
   */
  public static getMulti(
    skip?: number,
    limit: number = 100,
    title?: string,
    createdByUser?: string,
    sort?: string
  ): CancelablePromise<Array<Company>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/companies/",
      query: {
        skip: skip,
        limit: limit,
        title: title,
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
    title?: string,
    createdByUser?: string,
    sort?: string
  ) {
    return requestWithHeaders<Company[]>(OpenAPI, {
      method: "GET",
      url: "/api/companies/",
      query: {
        skip: skip,
        limit: limit,
        title: title,
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
   * Get Foundation Statistics
   * Statistics for companies foundation.
   *
   * Args:
   * company_dao (CompanyDAO, optional): Company DAO.
   *
   * Returns:
   * dict: Statistics for companies foundation.
   * @returns CompanyFoundationStatistics Successful Response
   * @throws ApiError
   */
  public static getFoundationStatistics(): CancelablePromise<Array<CompanyFoundationStatistics>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/companies/foundation-statistics",
    });
  }

  /**
   * Get Games Statistics
   * Statistics for companies' games.
   *
   * Args:
   * company_dao (CompanyDAO, optional): Company DAO.
   *
   * Returns:
   * dict: Statistics for companies' games.
   * @returns CompanyGamesStatistics Successful Response
   * @throws ApiError
   */
  public static getGamesStatistics(): CancelablePromise<Array<CompanyGamesStatistics>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/companies/games-statistics",
    });
  }

  /**
   * Create
   * Create company.
   *
   * Args:
   * company (CompanyCreate): Company data.
   * company_dao (CompanyDAO, optional): Company DAO.
   * current_superuser (User, optional): Current superuser.
   *
   * Returns:
   * Company: Company.
   * @param requestBody
   * @returns Company Successful Response
   * @throws ApiError
   */
  public static create(requestBody: CompanyCreate): CancelablePromise<Company> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/companies/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Multi
   * Delete companies.
   *
   * Args:
   * company_ids (list[UUID]): Company ids.
   * company_dao (CompanyDAO, optional): Company DAO.
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
      url: "/api/companies/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get
   * Get company by id.
   *
   * Args:
   * company_id (UUID): Company id.
   * company_dao (CompanyDAO, optional): Company DAO.
   *
   * Returns:
   * Company: Company.
   * @param companyId
   * @returns Company Successful Response
   * @throws ApiError
   */
  public static get(companyId: string): CancelablePromise<Company> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/companies/{company_id}",
      path: {
        company_id: companyId,
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
   * company_id (UUID): Company id.
   * company_dao (CompanyDAO, optional): Company DAO.
   * current_superuser (User, optional): Current superuser.
   *
   * Returns:
   * None: None.
   * @param companyId
   * @returns void
   * @throws ApiError
   */
  public static delete(companyId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/companies/{company_id}",
      path: {
        company_id: companyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update
   * Update company.
   *
   * Args:
   * company_id (UUID): Company id.
   * company (CompanyUpdate): Company data.
   * company_dao (CompanyDAO, optional): Company DAO.
   * current_superuser (User, optional): Current superuser.
   *
   * Returns:
   * Company: Company.
   * @param companyId
   * @param requestBody
   * @returns Company Successful Response
   * @throws ApiError
   */
  public static update(companyId: string, requestBody: CompanyUpdate): CancelablePromise<Company> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/companies/{company_id}",
      path: {
        company_id: companyId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
