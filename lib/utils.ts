export function getErrorMessage(error: unknown): string {
  if ((error as { message: string }).message)
    return (error as { message: string }).message;
  return String(error);
}
