grant select, update on public.profiles to authenticated;
grant select, update on public.accounts to authenticated;
grant select on public.account_members to authenticated;
grant execute on function public.is_account_member(uuid) to authenticated;
