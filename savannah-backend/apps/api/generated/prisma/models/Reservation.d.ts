import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReservationModel = runtime.Types.Result.DefaultSelection<Prisma.$ReservationPayload>;
export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null;
    _avg: ReservationAvgAggregateOutputType | null;
    _sum: ReservationSumAggregateOutputType | null;
    _min: ReservationMinAggregateOutputType | null;
    _max: ReservationMaxAggregateOutputType | null;
};
export type ReservationAvgAggregateOutputType = {
    guestCount: number | null;
};
export type ReservationSumAggregateOutputType = {
    guestCount: number | null;
};
export type ReservationMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    customerName: string | null;
    reservationDate: Date | null;
    reservationTime: string | null;
    guestCount: number | null;
    tableNumber: string | null;
    status: $Enums.ReservationStatus | null;
    specialRequests: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReservationMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    customerName: string | null;
    reservationDate: Date | null;
    reservationTime: string | null;
    guestCount: number | null;
    tableNumber: string | null;
    status: $Enums.ReservationStatus | null;
    specialRequests: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReservationCountAggregateOutputType = {
    id: number;
    customerId: number;
    customerName: number;
    reservationDate: number;
    reservationTime: number;
    guestCount: number;
    tableNumber: number;
    status: number;
    specialRequests: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ReservationAvgAggregateInputType = {
    guestCount?: true;
};
export type ReservationSumAggregateInputType = {
    guestCount?: true;
};
export type ReservationMinAggregateInputType = {
    id?: true;
    customerId?: true;
    customerName?: true;
    reservationDate?: true;
    reservationTime?: true;
    guestCount?: true;
    tableNumber?: true;
    status?: true;
    specialRequests?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReservationMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    customerName?: true;
    reservationDate?: true;
    reservationTime?: true;
    guestCount?: true;
    tableNumber?: true;
    status?: true;
    specialRequests?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReservationCountAggregateInputType = {
    id?: true;
    customerId?: true;
    customerName?: true;
    reservationDate?: true;
    reservationTime?: true;
    guestCount?: true;
    tableNumber?: true;
    status?: true;
    specialRequests?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ReservationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput | Prisma.ReservationOrderByWithRelationInput[];
    cursor?: Prisma.ReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReservationCountAggregateInputType;
    _avg?: ReservationAvgAggregateInputType;
    _sum?: ReservationSumAggregateInputType;
    _min?: ReservationMinAggregateInputType;
    _max?: ReservationMaxAggregateInputType;
};
export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
    [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReservation[P]> : Prisma.GetScalarType<T[P], AggregateReservation[P]>;
};
export type ReservationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithAggregationInput | Prisma.ReservationOrderByWithAggregationInput[];
    by: Prisma.ReservationScalarFieldEnum[] | Prisma.ReservationScalarFieldEnum;
    having?: Prisma.ReservationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReservationCountAggregateInputType | true;
    _avg?: ReservationAvgAggregateInputType;
    _sum?: ReservationSumAggregateInputType;
    _min?: ReservationMinAggregateInputType;
    _max?: ReservationMaxAggregateInputType;
};
export type ReservationGroupByOutputType = {
    id: string;
    customerId: string | null;
    customerName: string;
    reservationDate: Date;
    reservationTime: string;
    guestCount: number;
    tableNumber: string;
    status: $Enums.ReservationStatus;
    specialRequests: string;
    createdAt: Date;
    updatedAt: Date;
    _count: ReservationCountAggregateOutputType | null;
    _avg: ReservationAvgAggregateOutputType | null;
    _sum: ReservationSumAggregateOutputType | null;
    _min: ReservationMinAggregateOutputType | null;
    _max: ReservationMaxAggregateOutputType | null;
};
export type GetReservationGroupByPayload<T extends ReservationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReservationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReservationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReservationGroupByOutputType[P]>;
}>>;
export type ReservationWhereInput = {
    AND?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    OR?: Prisma.ReservationWhereInput[];
    NOT?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    id?: Prisma.StringFilter<"Reservation"> | string;
    customerId?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    customerName?: Prisma.StringFilter<"Reservation"> | string;
    reservationDate?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    reservationTime?: Prisma.StringFilter<"Reservation"> | string;
    guestCount?: Prisma.IntFilter<"Reservation"> | number;
    tableNumber?: Prisma.StringFilter<"Reservation"> | string;
    status?: Prisma.EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFilter<"Reservation"> | string;
    createdAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
};
export type ReservationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    reservationDate?: Prisma.SortOrder;
    reservationTime?: Prisma.SortOrder;
    guestCount?: Prisma.SortOrder;
    tableNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    specialRequests?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
};
export type ReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    OR?: Prisma.ReservationWhereInput[];
    NOT?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    customerId?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    customerName?: Prisma.StringFilter<"Reservation"> | string;
    reservationDate?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    reservationTime?: Prisma.StringFilter<"Reservation"> | string;
    guestCount?: Prisma.IntFilter<"Reservation"> | number;
    tableNumber?: Prisma.StringFilter<"Reservation"> | string;
    status?: Prisma.EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFilter<"Reservation"> | string;
    createdAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
}, "id">;
export type ReservationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    reservationDate?: Prisma.SortOrder;
    reservationTime?: Prisma.SortOrder;
    guestCount?: Prisma.SortOrder;
    tableNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    specialRequests?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ReservationCountOrderByAggregateInput;
    _avg?: Prisma.ReservationAvgOrderByAggregateInput;
    _max?: Prisma.ReservationMaxOrderByAggregateInput;
    _min?: Prisma.ReservationMinOrderByAggregateInput;
    _sum?: Prisma.ReservationSumOrderByAggregateInput;
};
export type ReservationScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReservationScalarWhereWithAggregatesInput | Prisma.ReservationScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReservationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReservationScalarWhereWithAggregatesInput | Prisma.ReservationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    customerId?: Prisma.StringNullableWithAggregatesFilter<"Reservation"> | string | null;
    customerName?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    reservationDate?: Prisma.DateTimeWithAggregatesFilter<"Reservation"> | Date | string;
    reservationTime?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    guestCount?: Prisma.IntWithAggregatesFilter<"Reservation"> | number;
    tableNumber?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    status?: Prisma.EnumReservationStatusWithAggregatesFilter<"Reservation"> | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Reservation"> | Date | string;
};
export type ReservationCreateInput = {
    id?: string;
    customerName: string;
    reservationDate: Date | string;
    reservationTime: string;
    guestCount: number;
    tableNumber: string;
    status?: $Enums.ReservationStatus;
    specialRequests?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutReservationsInput;
};
export type ReservationUncheckedCreateInput = {
    id?: string;
    customerId?: string | null;
    customerName: string;
    reservationDate: Date | string;
    reservationTime: string;
    guestCount: number;
    tableNumber: string;
    status?: $Enums.ReservationStatus;
    specialRequests?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    reservationDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reservationTime?: Prisma.StringFieldUpdateOperationsInput | string;
    guestCount?: Prisma.IntFieldUpdateOperationsInput | number;
    tableNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutReservationsNestedInput;
};
export type ReservationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    reservationDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reservationTime?: Prisma.StringFieldUpdateOperationsInput | string;
    guestCount?: Prisma.IntFieldUpdateOperationsInput | number;
    tableNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationCreateManyInput = {
    id?: string;
    customerId?: string | null;
    customerName: string;
    reservationDate: Date | string;
    reservationTime: string;
    guestCount: number;
    tableNumber: string;
    status?: $Enums.ReservationStatus;
    specialRequests?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    reservationDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reservationTime?: Prisma.StringFieldUpdateOperationsInput | string;
    guestCount?: Prisma.IntFieldUpdateOperationsInput | number;
    tableNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    reservationDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reservationTime?: Prisma.StringFieldUpdateOperationsInput | string;
    guestCount?: Prisma.IntFieldUpdateOperationsInput | number;
    tableNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationListRelationFilter = {
    every?: Prisma.ReservationWhereInput;
    some?: Prisma.ReservationWhereInput;
    none?: Prisma.ReservationWhereInput;
};
export type ReservationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReservationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    reservationDate?: Prisma.SortOrder;
    reservationTime?: Prisma.SortOrder;
    guestCount?: Prisma.SortOrder;
    tableNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    specialRequests?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReservationAvgOrderByAggregateInput = {
    guestCount?: Prisma.SortOrder;
};
export type ReservationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    reservationDate?: Prisma.SortOrder;
    reservationTime?: Prisma.SortOrder;
    guestCount?: Prisma.SortOrder;
    tableNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    specialRequests?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReservationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    reservationDate?: Prisma.SortOrder;
    reservationTime?: Prisma.SortOrder;
    guestCount?: Prisma.SortOrder;
    tableNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    specialRequests?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReservationSumOrderByAggregateInput = {
    guestCount?: Prisma.SortOrder;
};
export type ReservationCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerInput, Prisma.ReservationUncheckedCreateWithoutCustomerInput> | Prisma.ReservationCreateWithoutCustomerInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerInput | Prisma.ReservationCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ReservationCreateManyCustomerInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerInput, Prisma.ReservationUncheckedCreateWithoutCustomerInput> | Prisma.ReservationCreateWithoutCustomerInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerInput | Prisma.ReservationCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ReservationCreateManyCustomerInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerInput, Prisma.ReservationUncheckedCreateWithoutCustomerInput> | Prisma.ReservationCreateWithoutCustomerInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerInput | Prisma.ReservationCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ReservationCreateManyCustomerInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutCustomerInput | Prisma.ReservationUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerInput, Prisma.ReservationUncheckedCreateWithoutCustomerInput> | Prisma.ReservationCreateWithoutCustomerInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerInput | Prisma.ReservationCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ReservationCreateManyCustomerInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutCustomerInput | Prisma.ReservationUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type EnumReservationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReservationStatus;
};
export type ReservationCreateWithoutCustomerInput = {
    id?: string;
    customerName: string;
    reservationDate: Date | string;
    reservationTime: string;
    guestCount: number;
    tableNumber: string;
    status?: $Enums.ReservationStatus;
    specialRequests?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUncheckedCreateWithoutCustomerInput = {
    id?: string;
    customerName: string;
    reservationDate: Date | string;
    reservationTime: string;
    guestCount: number;
    tableNumber: string;
    status?: $Enums.ReservationStatus;
    specialRequests?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationCreateOrConnectWithoutCustomerInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerInput, Prisma.ReservationUncheckedCreateWithoutCustomerInput>;
};
export type ReservationCreateManyCustomerInputEnvelope = {
    data: Prisma.ReservationCreateManyCustomerInput | Prisma.ReservationCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type ReservationUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ReservationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutCustomerInput, Prisma.ReservationUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerInput, Prisma.ReservationUncheckedCreateWithoutCustomerInput>;
};
export type ReservationUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutCustomerInput, Prisma.ReservationUncheckedUpdateWithoutCustomerInput>;
};
export type ReservationUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.ReservationScalarWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyWithoutCustomerInput>;
};
export type ReservationScalarWhereInput = {
    AND?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
    OR?: Prisma.ReservationScalarWhereInput[];
    NOT?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
    id?: Prisma.StringFilter<"Reservation"> | string;
    customerId?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    customerName?: Prisma.StringFilter<"Reservation"> | string;
    reservationDate?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    reservationTime?: Prisma.StringFilter<"Reservation"> | string;
    guestCount?: Prisma.IntFilter<"Reservation"> | number;
    tableNumber?: Prisma.StringFilter<"Reservation"> | string;
    status?: Prisma.EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFilter<"Reservation"> | string;
    createdAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
};
export type ReservationCreateManyCustomerInput = {
    id?: string;
    customerName: string;
    reservationDate: Date | string;
    reservationTime: string;
    guestCount: number;
    tableNumber: string;
    status?: $Enums.ReservationStatus;
    specialRequests?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    reservationDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reservationTime?: Prisma.StringFieldUpdateOperationsInput | string;
    guestCount?: Prisma.IntFieldUpdateOperationsInput | number;
    tableNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    reservationDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reservationTime?: Prisma.StringFieldUpdateOperationsInput | string;
    guestCount?: Prisma.IntFieldUpdateOperationsInput | number;
    tableNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    reservationDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reservationTime?: Prisma.StringFieldUpdateOperationsInput | string;
    guestCount?: Prisma.IntFieldUpdateOperationsInput | number;
    tableNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    specialRequests?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    customerName?: boolean;
    reservationDate?: boolean;
    reservationTime?: boolean;
    guestCount?: boolean;
    tableNumber?: boolean;
    status?: boolean;
    specialRequests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.Reservation$customerArgs<ExtArgs>;
}, ExtArgs["result"]["reservation"]>;
export type ReservationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    customerName?: boolean;
    reservationDate?: boolean;
    reservationTime?: boolean;
    guestCount?: boolean;
    tableNumber?: boolean;
    status?: boolean;
    specialRequests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.Reservation$customerArgs<ExtArgs>;
}, ExtArgs["result"]["reservation"]>;
export type ReservationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    customerName?: boolean;
    reservationDate?: boolean;
    reservationTime?: boolean;
    guestCount?: boolean;
    tableNumber?: boolean;
    status?: boolean;
    specialRequests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.Reservation$customerArgs<ExtArgs>;
}, ExtArgs["result"]["reservation"]>;
export type ReservationSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    customerName?: boolean;
    reservationDate?: boolean;
    reservationTime?: boolean;
    guestCount?: boolean;
    tableNumber?: boolean;
    status?: boolean;
    specialRequests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ReservationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerId" | "customerName" | "reservationDate" | "reservationTime" | "guestCount" | "tableNumber" | "status" | "specialRequests" | "createdAt" | "updatedAt", ExtArgs["result"]["reservation"]>;
export type ReservationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.Reservation$customerArgs<ExtArgs>;
};
export type ReservationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.Reservation$customerArgs<ExtArgs>;
};
export type ReservationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.Reservation$customerArgs<ExtArgs>;
};
export type $ReservationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Reservation";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerId: string | null;
        customerName: string;
        reservationDate: Date;
        reservationTime: string;
        guestCount: number;
        tableNumber: string;
        status: $Enums.ReservationStatus;
        specialRequests: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["reservation"]>;
    composites: {};
};
export type ReservationGetPayload<S extends boolean | null | undefined | ReservationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReservationPayload, S>;
export type ReservationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReservationCountAggregateInputType | true;
};
export interface ReservationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Reservation'];
        meta: {
            name: 'Reservation';
        };
    };
    findUnique<T extends ReservationFindUniqueArgs>(args: Prisma.SelectSubset<T, ReservationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReservationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReservationFindFirstArgs>(args?: Prisma.SelectSubset<T, ReservationFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReservationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReservationFindManyArgs>(args?: Prisma.SelectSubset<T, ReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReservationCreateArgs>(args: Prisma.SelectSubset<T, ReservationCreateArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReservationCreateManyArgs>(args?: Prisma.SelectSubset<T, ReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReservationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReservationDeleteArgs>(args: Prisma.SelectSubset<T, ReservationDeleteArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReservationUpdateArgs>(args: Prisma.SelectSubset<T, ReservationUpdateArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReservationDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReservationUpdateManyArgs>(args: Prisma.SelectSubset<T, ReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReservationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReservationUpsertArgs>(args: Prisma.SelectSubset<T, ReservationUpsertArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReservationCountArgs>(args?: Prisma.Subset<T, ReservationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReservationCountAggregateOutputType> : number>;
    aggregate<T extends ReservationAggregateArgs>(args: Prisma.Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>;
    groupBy<T extends ReservationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReservationGroupByArgs['orderBy'];
    } : {
        orderBy?: ReservationGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReservationFieldRefs;
}
export interface Prisma__ReservationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.Reservation$customerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Reservation$customerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReservationFieldRefs {
    readonly id: Prisma.FieldRef<"Reservation", 'String'>;
    readonly customerId: Prisma.FieldRef<"Reservation", 'String'>;
    readonly customerName: Prisma.FieldRef<"Reservation", 'String'>;
    readonly reservationDate: Prisma.FieldRef<"Reservation", 'DateTime'>;
    readonly reservationTime: Prisma.FieldRef<"Reservation", 'String'>;
    readonly guestCount: Prisma.FieldRef<"Reservation", 'Int'>;
    readonly tableNumber: Prisma.FieldRef<"Reservation", 'String'>;
    readonly status: Prisma.FieldRef<"Reservation", 'ReservationStatus'>;
    readonly specialRequests: Prisma.FieldRef<"Reservation", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Reservation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Reservation", 'DateTime'>;
}
export type ReservationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput | Prisma.ReservationOrderByWithRelationInput[];
    cursor?: Prisma.ReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReservationScalarFieldEnum | Prisma.ReservationScalarFieldEnum[];
};
export type ReservationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput | Prisma.ReservationOrderByWithRelationInput[];
    cursor?: Prisma.ReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReservationScalarFieldEnum | Prisma.ReservationScalarFieldEnum[];
};
export type ReservationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput | Prisma.ReservationOrderByWithRelationInput[];
    cursor?: Prisma.ReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReservationScalarFieldEnum | Prisma.ReservationScalarFieldEnum[];
};
export type ReservationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReservationCreateInput, Prisma.ReservationUncheckedCreateInput>;
};
export type ReservationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReservationCreateManyInput | Prisma.ReservationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReservationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    data: Prisma.ReservationCreateManyInput | Prisma.ReservationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReservationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReservationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReservationUpdateInput, Prisma.ReservationUncheckedUpdateInput>;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyInput>;
    where?: Prisma.ReservationWhereInput;
    limit?: number;
};
export type ReservationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyInput>;
    where?: Prisma.ReservationWhereInput;
    limit?: number;
    include?: Prisma.ReservationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReservationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateInput, Prisma.ReservationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReservationUpdateInput, Prisma.ReservationUncheckedUpdateInput>;
};
export type ReservationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
    limit?: number;
};
export type Reservation$customerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
export type ReservationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
};
