from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from tortoise.exceptions import IntegrityError

from backend.custom_types import CompanyOrderColumns
from backend.db import models
from backend.db.dao import CompanyDAO
from backend.db.dependencies.order_validation import OrderValidation
from backend.db.dependencies.user import get_current_superuser
from backend.db.models.company import Company
from backend.exceptions import ObjectNotFoundException
from backend.web.api.company import schema
from backend.web.api.company.schema.company import Company as CompanySchema

router = APIRouter()


@router.get("/", response_model=list[CompanySchema])
async def get_multi(
    response: Response,
    queries: schema.CompanyQueries = Depends(),
    sort: list[str] = Depends(OrderValidation(CompanyOrderColumns)),
    company_dao: CompanyDAO = Depends(),
) -> list[Company]:
    """Get list of companies.

    Args:
        response (Response): Response.
        queries (CompanyQueries, optional): Query parameters.
        sort (list[str], optional): Order parameters.
        company_dao (CompanyDAO, optional): Company DAO.

    Returns:
        list[Company]: List of companies.
    """

    filters_dict = {
        "title": ("title__icontains", queries.title),
        "created_by_user": (
            "created_by_user__username__icontains",
            queries.created_by_user,
        ),
    }
    filters = queries.dict(exclude_none=True, include={*filters_dict.keys()})
    filters_list = {
        filters_dict[key][0]: filters_dict[key][1] for key in filters.keys()
    }

    amount = await company_dao.get_count(expr=filters_list)
    companies = await company_dao.get_multi(
        expr=filters_list,
        offset=queries.skip,
        limit=queries.limit,
        sort=sort,
    )

    response.headers["X-Total-Count"] = str(amount)
    return companies


@router.get("/{company_id}", response_model=CompanySchema)
async def get(company_id: UUID, company_dao: CompanyDAO = Depends()) -> Company:
    """Get company by id.

    Args:
        company_id (UUID): Company id.
        company_dao (CompanyDAO, optional): Company DAO.

    Returns:
        Company: Company.
    """

    company = await company_dao.get(str(company_id))
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )
    return company


@router.post("/", response_model=CompanySchema)
async def create(
    company: schema.CompanyCreate,
    company_dao: CompanyDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Company:
    """Create company.

    Args:
        company (CompanyCreate): Company data.
        company_dao (CompanyDAO, optional): Company DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        Company: Company.
    """

    try:
        return await company_dao.create_by_user(
            company.dict(),
            str(current_superuser.id),
        )
    except IntegrityError as error:
        if "already exists" in str(error):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(error).split(":  ")[1],
            )
        raise error


@router.patch("/{company_id}", response_model=CompanySchema)
async def update(
    company_id: UUID,
    company: schema.CompanyUpdate,
    company_dao: CompanyDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Company:
    """Update company.

    Args:
        company_id (UUID): Company id.
        company (CompanyUpdate): Company data.
        company_dao (CompanyDAO, optional): Company DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        Company: Company.
    """

    try:
        return await company_dao.update(
            company.dict(exclude_unset=True),
            str(company_id),
        )
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        ) from error
    except IntegrityError as error:
        if "already exists" in str(error):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(error).split(":  ")[1],
            )
        raise error


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multi(
    company_ids: list[UUID],
    company_dao: CompanyDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete companies.

    Args:
        company_ids (list[UUID]): Company ids.
        company_dao (CompanyDAO, optional): Company DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await company_dao.delete_multi([str(company_id) for company_id in company_ids])
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company(-ies) not found: {str(error)}",
        ) from error


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    company_id: UUID,
    company_dao: CompanyDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete company.

    Args:
        company_id (UUID): Company id.
        company_dao (CompanyDAO, optional): Company DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await company_dao.delete(str(company_id))
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        ) from error
