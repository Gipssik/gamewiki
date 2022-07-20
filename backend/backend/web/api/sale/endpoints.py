from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from tortoise.exceptions import IntegrityError

from backend.custom_types import SaleOrderColumns
from backend.db import models
from backend.db.dao.sale import SaleDAO
from backend.db.dependencies.order_validation import OrderValidation
from backend.db.dependencies.user import get_current_superuser
from backend.db.models.sale import Sale
from backend.exceptions import ObjectNotFoundException
from backend.web.api.sale import schema
from backend.web.api.sale.schema.sale import Sale as SaleSchema

router = APIRouter()


@router.get("/", response_model=list[SaleSchema])
async def get_multi(
    response: Response,
    queries: schema.SaleQueries = Depends(),
    sort: list[str] = Depends(OrderValidation(SaleOrderColumns)),
    sale_dao: SaleDAO = Depends(),
) -> list[Sale]:
    """Get list of sales.

    Args:
        response (Response): Response.
        queries (SaleQueries, optional): Sale queries.
        sort (list[str], optional): Order parameters.
        sale_dao (SaleDAO, optional): Sale DAO.

    Returns:
        list[Sale]: List of sales.
    """

    filters_dict = {
        "game": ("game__title__icontains", queries.game),
        "platform": ("platform__title__icontains", queries.platform),
        "created_by_user": (
            "created_by_user__username__icontains",
            queries.created_by_user,
        ),
    }
    filters = queries.dict(exclude_none=True, include={*filters_dict.keys()})
    filters_list = {
        filters_dict[key][0]: filters_dict[key][1] for key in filters.keys()
    }

    amount = await sale_dao.get_count(expr=filters_list)
    sales = await sale_dao.get_multi(
        expr=filters_list,
        offset=queries.skip,
        limit=queries.limit,
        sort=sort,
    )

    response.headers["X-Total-Count"] = str(amount)
    return sales


@router.get(
    "/popularity-statistics",
    response_model=list[schema.SalePopularityStatistics],
)
async def get_popularity_statistics(sale_dao: SaleDAO = Depends()) -> list[dict]:
    """Statistics for game-platform sale popularity.

    Args:
        sale_dao (SaleDAO): SaleDAO

    Returns:
        Sale: Statistics for game-platform sale popularity.
    """

    return await sale_dao.get_popularity_statistics()


@router.get("/{sale_id}", response_model=SaleSchema)
async def get(sale_id: UUID, sale_dao: SaleDAO = Depends()) -> Sale:
    """Get sale by id.

    Args:
        sale_id (UUID): Sale ID.
        sale_dao (SaleDAO): SaleDAO

    Returns:
        Sale: Sale
    """

    sale = await sale_dao.get(str(sale_id))
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        )
    return sale


@router.post("/", response_model=SaleSchema)
async def create(
    sale: schema.SaleCreate,
    sale_dao: SaleDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Sale:
    """Create a new sale

    Args:
        sale (SaleCreate): Sale data.
        sale_dao (SaleDAO): Sale DAO.
        current_superuser (User): Current superuser.

    Returns:
        Sale: A new sale.
    """

    try:
        return await sale_dao.create_by_user(sale.dict(), str(current_superuser.id))
    except IntegrityError as error:
        if "is not present" in str(error):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(error).split(":  ")[1],
            )
        elif "already exists" in str(error):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(error).split(":  ")[1],
            )
        raise error


@router.patch("/{sale_id}", response_model=SaleSchema)
async def update(
    sale_id: UUID,
    sale: schema.SaleUpdate,
    sale_dao: SaleDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Sale:
    """Update sale.

    Args:
        sale_id (UUID): Sale id.
        sale (SaleUpdate): Sale data.
        sale_dao (SaleDAO, optional): Sale DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        Sale: Sale.
    """

    try:
        return await sale_dao.update(
            sale.dict(exclude_unset=True),
            str(sale_id),
        )
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        ) from error
    except IntegrityError as error:
        if "is not present" in str(error):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(error).split(":  ")[1],
            )
        elif "already exists" in str(error):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(error).split(":  ")[1],
            )
        raise error


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multi(
    sale_ids: list[UUID],
    sale_dao: SaleDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete multiple companies.

    Args:
        sale_ids (list[UUID]): Sale ids.
        sale_dao (SaleDAO, optional): Sale DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await sale_dao.delete_multi([str(company_id) for company_id in sale_ids])
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sale(s) not found: {str(error)}",
        )


@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    sale_id: UUID,
    sale_dao: SaleDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete company.

    Args:
        sale_id (UUID): Sale id.
        sale_dao (CompanyDAO, optional): Sale DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await sale_dao.delete(str(sale_id))
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        ) from error
