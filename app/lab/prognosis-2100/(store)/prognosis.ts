import { useUpdateParams } from 'hooks/useUpdateParams';

const PROGNOSIS_KEY = 'prognosis';

export const usePrognosisStore = () => {
  const { searchParams, updateParams, deleteParam } = useUpdateParams();

  const showPrognosis = searchParams.has(PROGNOSIS_KEY);

  const togglePrognosis = () => {
    if (!showPrognosis) {
      updateParams({ [PROGNOSIS_KEY]: '' });
    } else {
      deleteParam(PROGNOSIS_KEY);
    }
  };

  return { showPrognosis, togglePrognosis };
};
