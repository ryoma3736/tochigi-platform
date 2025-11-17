import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompanyCard } from '@/components/customer/CompanyCard';

describe('CompanyCard', () => {
  const mockCompany = {
    id: '1',
    name: 'テスト業者株式会社',
    description: 'これはテスト業者の説明文です。高品質なサービスを提供します。',
    category: 'リフォーム',
    address: '栃木県宇都宮市中央1-1-1',
    phone: '028-1234-5678',
    website: 'https://example.com',
    instagramUrl: 'https://instagram.com/test',
    _count: {
      projects: 15,
    },
  };

  it('会社名が表示される', () => {
    render(<CompanyCard company={mockCompany} />);
    expect(screen.getByText('テスト業者株式会社')).toBeInTheDocument();
  });

  it('説明文が表示される', () => {
    render(<CompanyCard company={mockCompany} />);
    expect(screen.getByText(/これはテスト業者の説明文です/)).toBeInTheDocument();
  });

  it('カテゴリーが表示される', () => {
    render(<CompanyCard company={mockCompany} />);
    expect(screen.getByText('リフォーム')).toBeInTheDocument();
  });

  it('住所が表示される', () => {
    render(<CompanyCard company={mockCompany} />);
    expect(screen.getByText('栃木県宇都宮市中央1-1-1')).toBeInTheDocument();
  });

  it('施工実績が表示される', () => {
    render(<CompanyCard company={mockCompany} />);
    expect(screen.getByText('施工実績: 15件')).toBeInTheDocument();
  });

  it('説明がない場合、デフォルトテキストが表示される', () => {
    const companyWithoutDescription = {
      ...mockCompany,
      description: null,
    };
    render(<CompanyCard company={companyWithoutDescription} />);
    expect(screen.getByText('説明がありません')).toBeInTheDocument();
  });

  it('住所がない場合、住所は表示されない', () => {
    const companyWithoutAddress = {
      ...mockCompany,
      address: null,
    };
    render(<CompanyCard company={companyWithoutAddress} />);
    expect(screen.queryByText('栃木県宇都宮市中央1-1-1')).not.toBeInTheDocument();
  });

  it('施工実績が0件の場合、実績は表示されない', () => {
    const companyWithoutProjects = {
      ...mockCompany,
      _count: {
        projects: 0,
      },
    };
    render(<CompanyCard company={companyWithoutProjects} />);
    expect(screen.queryByText(/施工実績/)).not.toBeInTheDocument();
  });

  it('詳細を見るボタンが表示される', () => {
    render(<CompanyCard company={mockCompany} />);
    expect(screen.getByRole('button', { name: '詳細を見る' })).toBeInTheDocument();
  });

  it('問い合わせるボタンが表示される', () => {
    render(<CompanyCard company={mockCompany} />);
    expect(screen.getByRole('button', { name: '問い合わせる' })).toBeInTheDocument();
  });

  it('詳細リンクが正しいURLを持つ', () => {
    render(<CompanyCard company={mockCompany} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/companies/1');
  });

  it('カードがhoverでshadowスタイルを持つ', () => {
    const { container } = render(<CompanyCard company={mockCompany} />);
    const card = container.querySelector('.hover\\:shadow-lg');
    expect(card).toBeInTheDocument();
  });

  it('複数の会社情報が同時に表示できる', () => {
    const company2 = {
      ...mockCompany,
      id: '2',
      name: '別の業者',
    };

    const { rerender } = render(<CompanyCard company={mockCompany} />);
    expect(screen.getByText('テスト業者株式会社')).toBeInTheDocument();

    rerender(<CompanyCard company={company2} />);
    expect(screen.getByText('別の業者')).toBeInTheDocument();
  });

  it('長い説明文はline-clamp-2で切り詰められる', () => {
    const { container } = render(<CompanyCard company={mockCompany} />);
    const description = container.querySelector('.line-clamp-2');
    expect(description).toBeInTheDocument();
  });

  it('住所にアイコンが表示される', () => {
    const { container } = render(<CompanyCard company={mockCompany} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
