from enum import EnumMeta

from fastapi import HTTPException, Query, status


class OrderValidation:
    def __init__(self, columns_enum: EnumMeta):
        self.enum = columns_enum

    def __call__(self, sort: str = Query(default=None)) -> list[str]:
        if sort is None:
            return []

        params = [s.lstrip("+") for s in sort.split(",")]
        for i, param in enumerate(params):
            param_sign = "-" if param.startswith("-") else ""
            abs_param = param.lstrip("-")
            if abs_param not in self.enum._value2member_map_:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid order column: {param}",
                )
            params[i] = param_sign + str(self.enum(abs_param).name).lower()
        return params
