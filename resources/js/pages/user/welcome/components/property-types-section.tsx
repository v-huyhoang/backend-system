import { propertyTypes } from '../data';

export function PropertyTypesSection() {
	return (
		<section className="bg-white" aria-labelledby="loai-hinh">
			<div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6 lg:py-20">
				<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
					Khám phá theo nhu cầu
				</p>
				<h2
					id="loai-hinh"
					className="gtg-anchor mt-2 text-3xl font-bold tracking-[-0.03em]"
				>
					Bạn đang tìm loại phòng nào?
				</h2>
				<div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
					{propertyTypes.map(({ name, description, icon: Icon }) => (
						<a
							key={name}
							href="#phong-moi"
							className="group border-x border-t-2 border-b border-x-[var(--gtg-border)] border-t-[var(--gtg-primary)] border-b-[var(--gtg-border)] bg-white p-5 transition-colors hover:bg-[var(--gtg-surface-low)]"
						>
							<span className="grid size-11 place-items-center text-[var(--gtg-primary)]">
								<Icon className="size-5" aria-hidden="true" />
							</span>
							<h3 className="mt-5 font-bold">{name}</h3>
							<p className="mt-1 text-sm leading-5 text-[var(--gtg-muted)]">
								{description}
							</p>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
