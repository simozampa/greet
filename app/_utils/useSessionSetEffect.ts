import { useCallback, useEffect } from "react";
import { Session } from "next-auth";

export const useSessionSetEffect = (fun: Function, session: Session | null) => {

    const loadDataOnlyOnce = useCallback(fun, [session]);

    useEffect(() => {
        loadDataOnlyOnce(); // this will fire only when loadDataOnlyOnce-reference changes
    }, [loadDataOnlyOnce]);
}