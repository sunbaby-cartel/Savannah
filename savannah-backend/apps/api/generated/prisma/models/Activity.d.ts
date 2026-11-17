import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ActivityModel = runtime.Types.Result.DefaultSelection<Prisma.$ActivityPayload>;
export type AggregateActivity = {
    _count: ActivityCountAggregateOutputType | null;
    _min: ActivityMinAggregateOutputType | null;
    _max: ActivityMaxAggregateOutputType | null;
};
export type ActivityMinAggregateOutputType = {
    id: string | null;
    type: $Enums.ActivityType | null;
    message: string | null;
    entityId: string | null;
    timestamp: Date | null;
};
export type ActivityMaxAggregateOutputType = {
    id: string | null;
    type: $Enums.ActivityType | null;
    message: string | null;
    entityId: string | null;
    timestamp: Date | null;
};
export type ActivityCountAggregateOutputType = {
    id: number;
    type: number;
    message: number;
    entityId: number;
    timestamp: number;
    _all: number;
};
export type ActivityMinAggregateInputType = {
    id?: true;
    type?: true;
    message?: true;
    entityId?: true;
    timestamp?: true;
};
export type ActivityMaxAggregateInputType = {
    id?: true;
    type?: true;
    message?: true;
    entityId?: true;
    timestamp?: true;
};
export type ActivityCountAggregateInputType = {
    id?: true;
    type?: true;
    message?: true;
    entityId?: true;
    timestamp?: true;
    _all?: true;
};
export type ActivityAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityWhereInput;
    orderBy?: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[];
    cursor?: Prisma.ActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ActivityCountAggregateInputType;
    _min?: ActivityMinAggregateInputType;
    _max?: ActivityMaxAggregateInputType;
};
export type GetActivityAggregateType<T extends ActivityAggregateArgs> = {
    [P in keyof T & keyof AggregateActivity]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateActivity[P]> : Prisma.GetScalarType<T[P], AggregateActivity[P]>;
};
export type ActivityGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityWhereInput;
    orderBy?: Prisma.ActivityOrderByWithAggregationInput | Prisma.ActivityOrderByWithAggregationInput[];
    by: Prisma.ActivityScalarFieldEnum[] | Prisma.ActivityScalarFieldEnum;
    having?: Prisma.ActivityScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ActivityCountAggregateInputType | true;
    _min?: ActivityMinAggregateInputType;
    _max?: ActivityMaxAggregateInputType;
};
export type ActivityGroupByOutputType = {
    id: string;
    type: $Enums.ActivityType;
    message: string;
    entityId: string | null;
    timestamp: Date;
    _count: ActivityCountAggregateOutputType | null;
    _min: ActivityMinAggregateOutputType | null;
    _max: ActivityMaxAggregateOutputType | null;
};
export type GetActivityGroupByPayload<T extends ActivityGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ActivityGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ActivityGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ActivityGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ActivityGroupByOutputType[P]>;
}>>;
export type ActivityWhereInput = {
    AND?: Prisma.ActivityWhereInput | Prisma.ActivityWhereInput[];
    OR?: Prisma.ActivityWhereInput[];
    NOT?: Prisma.ActivityWhereInput | Prisma.ActivityWhereInput[];
    id?: Prisma.StringFilter<"Activity"> | string;
    type?: Prisma.EnumActivityTypeFilter<"Activity"> | $Enums.ActivityType;
    message?: Prisma.StringFilter<"Activity"> | string;
    entityId?: Prisma.StringNullableFilter<"Activity"> | string | null;
    timestamp?: Prisma.DateTimeFilter<"Activity"> | Date | string;
};
export type ActivityOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    entityId?: Prisma.SortOrderInput | Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type ActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ActivityWhereInput | Prisma.ActivityWhereInput[];
    OR?: Prisma.ActivityWhereInput[];
    NOT?: Prisma.ActivityWhereInput | Prisma.ActivityWhereInput[];
    type?: Prisma.EnumActivityTypeFilter<"Activity"> | $Enums.ActivityType;
    message?: Prisma.StringFilter<"Activity"> | string;
    entityId?: Prisma.StringNullableFilter<"Activity"> | string | null;
    timestamp?: Prisma.DateTimeFilter<"Activity"> | Date | string;
}, "id">;
export type ActivityOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    entityId?: Prisma.SortOrderInput | Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    _count?: Prisma.ActivityCountOrderByAggregateInput;
    _max?: Prisma.ActivityMaxOrderByAggregateInput;
    _min?: Prisma.ActivityMinOrderByAggregateInput;
};
export type ActivityScalarWhereWithAggregatesInput = {
    AND?: Prisma.ActivityScalarWhereWithAggregatesInput | Prisma.ActivityScalarWhereWithAggregatesInput[];
    OR?: Prisma.ActivityScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ActivityScalarWhereWithAggregatesInput | Prisma.ActivityScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Activity"> | string;
    type?: Prisma.EnumActivityTypeWithAggregatesFilter<"Activity"> | $Enums.ActivityType;
    message?: Prisma.StringWithAggregatesFilter<"Activity"> | string;
    entityId?: Prisma.StringNullableWithAggregatesFilter<"Activity"> | string | null;
    timestamp?: Prisma.DateTimeWithAggregatesFilter<"Activity"> | Date | string;
};
export type ActivityCreateInput = {
    id?: string;
    type: $Enums.ActivityType;
    message: string;
    entityId?: string | null;
    timestamp?: Date | string;
};
export type ActivityUncheckedCreateInput = {
    id?: string;
    type: $Enums.ActivityType;
    message: string;
    entityId?: string | null;
    timestamp?: Date | string;
};
export type ActivityUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityCreateManyInput = {
    id?: string;
    type: $Enums.ActivityType;
    message: string;
    entityId?: string | null;
    timestamp?: Date | string;
};
export type ActivityUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumActivityTypeFieldUpdateOperationsInput | $Enums.ActivityType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type ActivityMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type ActivityMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type EnumActivityTypeFieldUpdateOperationsInput = {
    set?: $Enums.ActivityType;
};
export type ActivitySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    message?: boolean;
    entityId?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["activity"]>;
export type ActivitySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    message?: boolean;
    entityId?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["activity"]>;
export type ActivitySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    message?: boolean;
    entityId?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["activity"]>;
export type ActivitySelectScalar = {
    id?: boolean;
    type?: boolean;
    message?: boolean;
    entityId?: boolean;
    timestamp?: boolean;
};
export type ActivityOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "type" | "message" | "entityId" | "timestamp", ExtArgs["result"]["activity"]>;
export type $ActivityPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Activity";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        type: $Enums.ActivityType;
        message: string;
        entityId: string | null;
        timestamp: Date;
    }, ExtArgs["result"]["activity"]>;
    composites: {};
};
export type ActivityGetPayload<S extends boolean | null | undefined | ActivityDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ActivityPayload, S>;
export type ActivityCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ActivityCountAggregateInputType | true;
};
export interface ActivityDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Activity'];
        meta: {
            name: 'Activity';
        };
    };
    findUnique<T extends ActivityFindUniqueArgs>(args: Prisma.SelectSubset<T, ActivityFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ActivityFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ActivityFindFirstArgs>(args?: Prisma.SelectSubset<T, ActivityFindFirstArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ActivityFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ActivityFindManyArgs>(args?: Prisma.SelectSubset<T, ActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ActivityCreateArgs>(args: Prisma.SelectSubset<T, ActivityCreateArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ActivityCreateManyArgs>(args?: Prisma.SelectSubset<T, ActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ActivityCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ActivityDeleteArgs>(args: Prisma.SelectSubset<T, ActivityDeleteArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ActivityUpdateArgs>(args: Prisma.SelectSubset<T, ActivityUpdateArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ActivityDeleteManyArgs>(args?: Prisma.SelectSubset<T, ActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ActivityUpdateManyArgs>(args: Prisma.SelectSubset<T, ActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ActivityUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ActivityUpsertArgs>(args: Prisma.SelectSubset<T, ActivityUpsertArgs<ExtArgs>>): Prisma.Prisma__ActivityClient<runtime.Types.Result.GetResult<Prisma.$ActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ActivityCountArgs>(args?: Prisma.Subset<T, ActivityCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ActivityCountAggregateOutputType> : number>;
    aggregate<T extends ActivityAggregateArgs>(args: Prisma.Subset<T, ActivityAggregateArgs>): Prisma.PrismaPromise<GetActivityAggregateType<T>>;
    groupBy<T extends ActivityGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ActivityGroupByArgs['orderBy'];
    } : {
        orderBy?: ActivityGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ActivityFieldRefs;
}
export interface Prisma__ActivityClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ActivityFieldRefs {
    readonly id: Prisma.FieldRef<"Activity", 'String'>;
    readonly type: Prisma.FieldRef<"Activity", 'ActivityType'>;
    readonly message: Prisma.FieldRef<"Activity", 'String'>;
    readonly entityId: Prisma.FieldRef<"Activity", 'String'>;
    readonly timestamp: Prisma.FieldRef<"Activity", 'DateTime'>;
}
export type ActivityFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    where: Prisma.ActivityWhereUniqueInput;
};
export type ActivityFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    where: Prisma.ActivityWhereUniqueInput;
};
export type ActivityFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    where?: Prisma.ActivityWhereInput;
    orderBy?: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[];
    cursor?: Prisma.ActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ActivityScalarFieldEnum | Prisma.ActivityScalarFieldEnum[];
};
export type ActivityFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    where?: Prisma.ActivityWhereInput;
    orderBy?: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[];
    cursor?: Prisma.ActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ActivityScalarFieldEnum | Prisma.ActivityScalarFieldEnum[];
};
export type ActivityFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    where?: Prisma.ActivityWhereInput;
    orderBy?: Prisma.ActivityOrderByWithRelationInput | Prisma.ActivityOrderByWithRelationInput[];
    cursor?: Prisma.ActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ActivityScalarFieldEnum | Prisma.ActivityScalarFieldEnum[];
};
export type ActivityCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityCreateInput, Prisma.ActivityUncheckedCreateInput>;
};
export type ActivityCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ActivityCreateManyInput | Prisma.ActivityCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ActivityCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    data: Prisma.ActivityCreateManyInput | Prisma.ActivityCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ActivityUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityUpdateInput, Prisma.ActivityUncheckedUpdateInput>;
    where: Prisma.ActivityWhereUniqueInput;
};
export type ActivityUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ActivityUpdateManyMutationInput, Prisma.ActivityUncheckedUpdateManyInput>;
    where?: Prisma.ActivityWhereInput;
    limit?: number;
};
export type ActivityUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityUpdateManyMutationInput, Prisma.ActivityUncheckedUpdateManyInput>;
    where?: Prisma.ActivityWhereInput;
    limit?: number;
};
export type ActivityUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    where: Prisma.ActivityWhereUniqueInput;
    create: Prisma.XOR<Prisma.ActivityCreateInput, Prisma.ActivityUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ActivityUpdateInput, Prisma.ActivityUncheckedUpdateInput>;
};
export type ActivityDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
    where: Prisma.ActivityWhereUniqueInput;
};
export type ActivityDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityWhereInput;
    limit?: number;
};
export type ActivityDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivitySelect<ExtArgs> | null;
    omit?: Prisma.ActivityOmit<ExtArgs> | null;
};
