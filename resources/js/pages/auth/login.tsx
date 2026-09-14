import AuthenticatedSessionController from '@/actions/App/Presentation/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request as passwordRequest } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import {
	Building2,
	CheckCircle2,
	LoaderCircle,
	ShieldCheck,
} from 'lucide-react';

interface LoginProps {
	status?: string;
	canResetPassword: boolean;
}

const benefits = [
	'Tìm lại các tin đã lưu và khu vực quan tâm',
	'Đăng, theo dõi và chỉnh sửa tin cho thuê',
	'Một tài khoản dùng cho mọi nhu cầu tại Trọ Đây',
] as const;

export default function Login({ status, canResetPassword }: LoginProps) {
	return (
		<div className="gtg-theme flex min-h-screen flex-col bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title="Đăng nhập | Trọ Đây" />
			<PublicHeader />
			<main id="main-content" className="flex-1 pt-16">
				<div className="mx-auto grid max-w-[1120px] gap-10 px-4 py-10 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-16">
					<section
						className="lg:pt-10"
						aria-labelledby="login-heading"
					>
						<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
							Chào mừng trở lại
						</p>
						<h1
							id="login-heading"
							className="mt-3 max-w-md text-4xl leading-tight font-bold tracking-[-0.04em] text-balance"
						>
							Tìm phòng và quản lý tin đăng, trong một nơi.
						</h1>
						<p className="mt-4 max-w-lg leading-7 text-[var(--gtg-muted)]">
							Đăng nhập để tiếp tục hành trình tìm chỗ ở hoặc quản
							lý tin cho thuê của bạn.
						</p>
						<div className="mt-8 rounded-xl border border-[var(--gtg-border)] bg-white p-5 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="grid size-11 place-items-center rounded-xl bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary)]">
									<Building2
										className="size-5"
										aria-hidden="true"
									/>
								</div>
								<p className="font-semibold">
									Một tài khoản cho mọi tin đăng
								</p>
							</div>
							<ul className="mt-5 space-y-3">
								{benefits.map((benefit) => (
									<li
										key={benefit}
										className="flex gap-2.5 text-sm text-[var(--gtg-muted)]"
									>
										<CheckCircle2
											className="mt-0.5 size-4 shrink-0 text-[var(--gtg-primary)]"
											aria-hidden="true"
										/>
										{benefit}
									</li>
								))}
							</ul>
						</div>
					</section>

					<section
						className="rounded-2xl border border-[var(--gtg-border)] bg-white p-5 shadow-sm sm:p-8"
						aria-label="Form đăng nhập"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-2xl font-bold tracking-[-0.03em]">
									Đăng nhập
								</h2>
								<p className="mt-2 text-sm text-[var(--gtg-muted)]">
									Chưa có tài khoản?{' '}
									<Link
										href={register()}
										className="font-semibold text-[var(--gtg-primary)] hover:underline"
									>
										Tạo tài khoản
									</Link>
								</p>
							</div>
							<ShieldCheck
								className="size-6 text-[var(--gtg-primary)]"
								aria-hidden="true"
							/>
						</div>

						{status && (
							<p
								className="mt-5 rounded-lg bg-[var(--gtg-primary-soft)] px-3 py-2 text-sm font-medium text-[var(--gtg-primary-dark)]"
								role="status"
							>
								{status}
							</p>
						)}

						<Form
							{...AuthenticatedSessionController.store.form()}
							resetOnSuccess={['password']}
							disableWhileProcessing
							className="mt-7"
						>
							{({ processing, errors }) => (
								<fieldset
									disabled={processing}
									className="grid gap-5"
								>
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											name="email"
											type="email"
											required
											autoFocus
											autoComplete="email"
											placeholder="ban@email.com"
											className="min-h-12 border-[var(--gtg-border-strong)] bg-white text-base focus-visible:border-[var(--gtg-primary)] focus-visible:ring-[var(--gtg-primary-soft)]"
										/>
										<InputError message={errors.email} />
									</div>

									<div className="grid gap-2">
										<div className="flex items-center justify-between gap-3">
											<Label htmlFor="password">
												Mật khẩu
											</Label>
											{canResetPassword && (
												<Link
													href={passwordRequest()}
													className="text-sm font-semibold text-[var(--gtg-primary)] hover:underline"
												>
													Quên mật khẩu?
												</Link>
											)}
										</div>
										<Input
											id="password"
											name="password"
											type="password"
											required
											autoComplete="current-password"
											placeholder="Nhập mật khẩu"
											className="min-h-12 border-[var(--gtg-border-strong)] bg-white text-base focus-visible:border-[var(--gtg-primary)] focus-visible:ring-[var(--gtg-primary-soft)]"
										/>
										<InputError message={errors.password} />
									</div>

									<label className="flex min-h-11 items-center gap-3 text-sm text-[var(--gtg-muted)]">
										<Checkbox
											id="remember"
											name="remember"
										/>
										Ghi nhớ đăng nhập trên thiết bị này
									</label>

									<Button
										type="submit"
										className="min-h-12 w-full rounded-[10px] bg-[var(--gtg-primary)] text-base font-semibold hover:bg-[var(--gtg-primary-dark)]"
										data-test="login-button"
									>
										{processing && (
											<LoaderCircle
												className="size-5 animate-spin"
												aria-hidden="true"
											/>
										)}
										Đăng nhập
									</Button>
								</fieldset>
							)}
						</Form>
					</section>
				</div>
			</main>
			<PublicFooter />
		</div>
	);
}
