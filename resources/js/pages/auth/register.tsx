import RegisteredUserController from '@/actions/App/Presentation/Http/Controllers/Auth/RegisteredUserController';
import InputError from '@/components/input-error';
import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import {
	Building2,
	CheckCircle2,
	LoaderCircle,
	ShieldCheck,
} from 'lucide-react';

const benefits = [
	'Đăng và quản lý tin trong một nơi',
	'Theo dõi trạng thái duyệt tin rõ ràng',
	'Chỉnh sửa hoặc ẩn tin khi cần',
] as const;

export default function Register() {
	return (
		<div className="gtg-theme flex min-h-screen flex-col bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title="Đăng ký để đăng phòng | Trọ Đây" />
			<PublicHeader />
			<main id="main-content" className="flex-1 pt-16">
				<div className="mx-auto grid max-w-[1120px] gap-10 px-4 py-10 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-16">
					<section
						className="lg:pt-10"
						aria-labelledby="register-heading"
					>
						<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
							Dành cho chủ trọ
						</p>
						<h1
							id="register-heading"
							className="mt-3 max-w-md text-4xl leading-tight font-bold tracking-[-0.04em] text-balance"
						>
							Đăng phòng dễ dàng, quản lý gọn gàng.
						</h1>
						<p className="mt-4 max-w-lg leading-7 text-[var(--gtg-muted)]">
							Tạo tài khoản để bắt đầu đăng tin cho thuê. Thông
							tin phòng sẽ được bổ sung ở bước tiếp theo.
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
						aria-label="Form tạo tài khoản chủ trọ"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-2xl font-bold tracking-[-0.03em]">
									Tạo tài khoản
								</h2>
								<p className="mt-2 text-sm text-[var(--gtg-muted)]">
									Đã có tài khoản?{' '}
									<Link
										href={login()}
										className="font-semibold text-[var(--gtg-primary)] hover:underline"
									>
										Đăng nhập
									</Link>
								</p>
							</div>
							<ShieldCheck
								className="size-6 text-[var(--gtg-primary)]"
								aria-hidden="true"
							/>
						</div>
						<Form
							{...RegisteredUserController.store.form()}
							resetOnSuccess={[
								'password',
								'password_confirmation',
							]}
							disableWhileProcessing
							className="mt-7"
						>
							{({ processing, errors }) => (
								<fieldset
									disabled={processing}
									className="grid gap-5"
								>
									<Field
										id="name"
										label="Họ và tên"
										type="text"
										autoComplete="name"
										placeholder="Ví dụ: Nguyễn Minh Anh"
										autoFocus
										error={errors.name}
									/>
									<Field
										id="email"
										label="Email"
										type="email"
										autoComplete="email"
										placeholder="ban@email.com"
										error={errors.email}
									/>
									<div className="grid gap-5 sm:grid-cols-2">
										<Field
											id="password"
											label="Mật khẩu"
											type="password"
											autoComplete="new-password"
											placeholder="Ít nhất 8 ký tự"
											error={errors.password}
										/>
										<Field
											id="password_confirmation"
											label="Xác nhận mật khẩu"
											type="password"
											autoComplete="new-password"
											placeholder="Nhập lại mật khẩu"
											error={errors.password_confirmation}
										/>
									</div>
									<Button
										type="submit"
										className="min-h-12 w-full rounded-[10px] bg-[var(--gtg-primary)] text-base font-semibold hover:bg-[var(--gtg-primary-dark)]"
										data-test="register-user-button"
									>
										{processing && (
											<LoaderCircle
												className="size-5 animate-spin"
												aria-hidden="true"
											/>
										)}
										Tạo tài khoản để đăng phòng
									</Button>
									<p className="text-center text-xs leading-5 text-[var(--gtg-muted)]">
										Bằng việc tiếp tục, bạn đồng ý sử dụng
										Trọ Đây một cách trung thực và tuân thủ
										quy định đăng tin.
									</p>
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

function Field({
	id,
	label,
	error,
	...props
}: {
	id: string;
	label: string;
	error?: string;
	type: string;
	autoComplete: string;
	placeholder: string;
	autoFocus?: boolean;
}) {
	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				name={id}
				required
				{...props}
				className="min-h-12 border-[var(--gtg-border-strong)] bg-white text-base focus-visible:border-[var(--gtg-primary)] focus-visible:ring-[var(--gtg-primary-soft)]"
			/>
			<InputError message={error} />
		</div>
	);
}
